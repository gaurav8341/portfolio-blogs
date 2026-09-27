import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import ResumePage from './ResumePage';

jest.mock('axios');

/* Pages are rendered directly rather than through <App />: App pulls in
   mermaid and react-markdown via BlogDetail, which are ESM-only and not worth
   transforming for a smoke test. */
const withRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

/* Renders and waits for the fetches to settle. Asserting before the skeletons
   clear leaves state updates landing outside act() once the test has finished. */
const renderSettled = async (ui) => {
  const utils = withRouter(ui);
  await waitFor(() => expect(utils.container.querySelector('.skeleton')).toBeNull());
  return utils;
};

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (typeof url === 'string' && url.endsWith('/url.json')) {
      return Promise.resolve({
        data: {
          featuredProjectsPath: '/projects.json',
          featuredBlogsPath: '/blogs.json',
          skillsJsonPath: '/skills.json',
          blogsJsonPath: '/all-blogs.json',
        },
      });
    }
    return Promise.resolve({ data: [] });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Home', () => {
  test('renders the hero and every section once data settles', async () => {
    await renderSettled(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: /happiest when a messy problem/i })
    ).toBeInTheDocument();

    [/How I think/, /Lately/, /What I.?ve shipped/, /What I.?m into/, /Skills & tools/, /Tools I use/, /Get in touch/]
      .forEach((kicker) => {
        expect(screen.getByText(kicker)).toBeInTheDocument();
      });
  });

  test('reveals content when IntersectionObserver is unavailable', async () => {
    // jsdom has no IntersectionObserver, which is the fallback path: sections
    // must end up revealed rather than stuck at opacity 0.
    const { container } = await renderSettled(<Home />);

    // Lists that mount with the loaded data reveal one tick later, when their
    // own effect runs, so this has to settle rather than assert immediately.
    await waitFor(() => {
      const reveals = container.querySelectorAll('.reveal');
      expect(reveals.length).toBeGreaterThan(0);
      reveals.forEach((el) => expect(el).toHaveClass('revealed'));
    });
  });
});

describe('ResumePage', () => {
  test('expands an entry on click and keeps the panel mounted when collapsed', () => {
    const { container } = withRouter(<ResumePage />);

    const header = screen.getByRole('button', { name: /Software Developer/i });
    const panel = container.querySelector('.resume-details-wrap');

    // Panel stays in the DOM while collapsed so the height can animate.
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveClass('open');
    expect(header).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('.resume-details-wrap')).toHaveClass('open');
    expect(screen.getByText(/Shipped 6\+ client projects solo/i)).toBeInTheDocument();
  });

  test('filters entries by type', () => {
    withRouter(<ResumePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Education' }));

    expect(screen.getByText('B.Tech, Computer Science')).toBeInTheDocument();
    expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
  });
});
