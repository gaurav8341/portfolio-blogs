import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import ResumePage from './ResumePage';
import { resetProfileCache } from './useProfile';

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

const PROFILE = {
  uses: [{ category: 'Shell', items: ['zsh'] }],
  work: [
    {
      id: 'upr',
      role: 'Senior Software Engineer',
      org: 'UrbanPiper',
      period: 'Nov 2025 — Present',
      summary: 'Order squad.',
      details: ['Aggregator integrations.', 'Cross-service debugging.'],
      skills: ['Python', 'MySQL'],
    },
  ],
  education: [
    {
      id: 'edu',
      role: 'B.Tech, Computer Science',
      details: ['Coursework.'],
      skills: ['Python'],
    },
  ],
};

beforeEach(() => {
  // profile.json is cached in module scope, so each test starts from empty.
  resetProfileCache();

  axios.get.mockImplementation((url) => {
    if (typeof url === 'string' && url.endsWith('/url.json')) {
      return Promise.resolve({
        data: {
          profilePath: '/profile.json',
          featuredProjectsPath: '/projects.json',
          featuredBlogsPath: '/blogs.json',
          skillsJsonPath: '/skills.json',
          blogsJsonPath: '/all-blogs.json',
        },
      });
    }
    if (typeof url === 'string' && url.endsWith('/profile.json')) {
      return Promise.resolve({ data: PROFILE });
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
      screen.getByRole('heading', { level: 1, name: /carry a food order/i })
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
  test('expands an entry on click and keeps the panel mounted when collapsed', async () => {
    const { container } = await renderSettled(<ResumePage />);

    const header = screen.getByRole('button', { name: /Senior Software Engineer/i });
    const panel = container.querySelector('.resume-details-wrap');

    // Panel stays in the DOM while collapsed so the height can animate.
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveClass('open');
    expect(header).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('.resume-details-wrap')).toHaveClass('open');
    expect(screen.getByText('Aggregator integrations.')).toBeInTheDocument();
  });

  test('renders an entry with no period or org without breaking', async () => {
    // Résumé entries come from remote JSON, so optional fields must be guarded.
    await renderSettled(<ResumePage />);

    const header = screen.getByRole('button', { name: /B\.Tech/i });
    expect(header).toBeInTheDocument();
    expect(header.querySelector('.resume-entry-period')).toBeNull();
    expect(header.querySelector('.resume-entry-org')).toBeNull();
  });

  test('renders work and education as separate sections, both visible at once', async () => {
    await renderSettled(<ResumePage />);

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('B.Tech, Computer Science')).toBeInTheDocument();
  });

  test('filtering by a skill hides sections with no match', async () => {
    await renderSettled(<ResumePage />);

    // MySQL belongs only to the work entry, so Education drops out entirely.
    fireEvent.click(screen.getByRole('button', { name: 'MySQL' }));

    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.queryByText('B.Tech, Computer Science')).not.toBeInTheDocument();
    expect(screen.queryByText('Education')).not.toBeInTheDocument();

    // Python is on both, so both sections come back.
    fireEvent.click(screen.getByRole('button', { name: 'MySQL' }));
    fireEvent.click(screen.getByRole('button', { name: 'Python' }));

    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('B.Tech, Computer Science')).toBeInTheDocument();
  });

  test('falls back to the older single-array resume shape', async () => {
    // Guards the deploy window where the feed and the code disagree.
    axios.get.mockImplementation((url) => {
      if (typeof url === 'string' && url.endsWith('/url.json')) {
        return Promise.resolve({ data: { profilePath: '/profile.json' } });
      }
      return Promise.resolve({
        data: {
          resume: [
            { id: 'w', type: 'work', role: 'Legacy Role', details: ['x'], skills: ['Go'] },
            { id: 'e', type: 'education', role: 'Legacy Degree', skills: ['Go'] },
          ],
        },
      });
    });

    withRouter(<ResumePage />);

    expect(await screen.findByText('Legacy Role')).toBeInTheDocument();
    expect(screen.getByText('Legacy Degree')).toBeInTheDocument();
  });
});
