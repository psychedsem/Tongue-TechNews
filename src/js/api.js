import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
  timeout: 10000,
});

export async function fetchNewStoryIds() {
  const { data } = await api.get('/newstories.json');

  if (!Array.isArray(data)) {
    throw new TypeError('Risposta non valida da Hacker News');
  }

  return data;
}

export async function fetchStoryById(id) {
  const { data } = await api.get(`/item/${id}.json`);
  return data;
}

export async function fetchStoriesByIds(ids) {
  const results = await Promise.allSettled(ids.map((id) => fetchStoryById(id)));
  const stories = [];
  const failedIds = [];

  results.forEach((result, index) => {
    const story = result.status === 'fulfilled' ? result.value : null;

    if (story && !story.deleted && !story.dead) {
      stories.push(story);
    } else {
      failedIds.push(ids[index]);
    }
  });

  return { stories, failedIds };
}
