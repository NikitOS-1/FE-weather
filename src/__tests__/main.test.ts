import React from 'react';

jest.mock('react-dom/client', () => {
  const render = jest.fn();
  const createRoot = jest.fn(() => ({ render }));
  return { createRoot, __esModule: true };
});

jest.mock('chart.js', () => ({
  Chart: { register: jest.fn() },
  LineElement: jest.fn(),
  PointElement: jest.fn(),
  LinearScale: jest.fn(),
  CategoryScale: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  __esModule: true,
}));

jest.mock('../containers/App/App', () => ({
  __esModule: true,
  default: () => React.createElement('div', null, 'App Component'),
}));

jest.mock('../store/store', () => ({
  store: {},
  __esModule: true,
}));

jest.mock('../commons/constants', () => ({
  WEATHER_API: {
    API_KEY: 'test-key',
    BASE_URL: 'https://api.openweathermap.org',
  },
  STORAGE: { KEY: 'weather_cities' },
  getWeatherIcon: () => '☀️',
  __esModule: true,
}));

describe('Application root', () => {
  let rootContainer: HTMLDivElement;
  let createRoot: jest.Mock;
  let render: jest.Mock;

  beforeEach(() => {
    rootContainer = document.createElement('div');
    rootContainer.id = 'root';
    document.body.appendChild(rootContainer);

    jest.resetModules();

    ({ createRoot } = require('react-dom/client'));
    render = createRoot(rootContainer).render;

    require('../main');
  });

  afterEach(() => {
    document.body.removeChild(rootContainer);
    jest.clearAllMocks();
  });

  it('should create root and render app', () => {
    expect(createRoot).toHaveBeenCalledWith(rootContainer);
    expect(render).toHaveBeenCalled();

    const renderCall = render.mock.calls[0][0];

    // StrictMode
    expect(renderCall.type).toBe(React.StrictMode);

    // Provider
    const provider = renderCall.props.children;
    expect(provider.type && provider.type.name).toBe('Provider');

    // BrowserRouter
    const browserRouter = provider.props.children;
    expect(browserRouter.type && browserRouter.type.name).toBe('BrowserRouter');

    // App
    const app = browserRouter.props.children;
    expect(app.type().props.children).toBe('App Component');
  });

  it('should register ChartJS components', () => {
    const chart = require('chart.js');
    expect(chart.Chart.register).toHaveBeenCalled();
  });
});
