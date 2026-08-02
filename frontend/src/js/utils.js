import axios from 'axios';

export const fetchUrls = async () => {
  const response = await axios.get('/url.json');
  return response.data;
};

export const renderStars = (experience) => {
  const filled = Math.max(0, Math.min(5, experience || 0));
  return '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled);
};

export const readingTime = (text) => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const GITHUB_EVENT_VERBS = {
  PushEvent: 'pushed to',
  CreateEvent: 'created',
  PullRequestEvent: 'opened a PR on',
  IssuesEvent: 'opened an issue on',
  WatchEvent: 'starred',
  ForkEvent: 'forked',
  IssueCommentEvent: 'commented on',
};

export const describeGithubEvent = (type) => GITHUB_EVENT_VERBS[type] || 'was active on';

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
