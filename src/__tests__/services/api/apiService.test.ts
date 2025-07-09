import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiService, { get } from '../../../services/api/apiService';
import { HTTP_REQUEST_TYPE } from '../../../commons/enums';

jest.mock('../../../commons/constants', () => ({
  __esModule: true,
}));

describe('apiService', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should perform GET request and return data', async () => {
    const mockData = { foo: 'bar' };
    mock.onGet('/test').reply(200, mockData);

    const data = await apiService.get('/test', HTTP_REQUEST_TYPE.JSON);
    expect(data).toEqual(mockData);
  });

  it('should throw and log error on failed GET request', async () => {
    mock.onGet('/fail').reply(500);

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await expect(get('/fail')).rejects.toBeTruthy();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Error occurred on get request'));

    logSpy.mockRestore();
  });
});
