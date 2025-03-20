import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SelectorComponent } from './SelectorComponent';
import { BASE_URL } from '../config';

describe('SelectorComponent', () => {
  let mockAxios;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'exercises') return JSON.stringify([{ id: 1, name: 'Exercise 1' }]);
      if (key === 'taskValues') return JSON.stringify({ difficulty: 'közép' });
      return null;
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  it('should render the component and display loading spinner initially', async () => {
    mockAxios.onGet(`${BASE_URL}/erettsegizzunk/Themes/get-temak-feladatonkent`).reply(200, {
        "matematika": [
            { "theme": { "id": 1, "name": "kecske" }, "count": 9 },
            { "theme": { "id": 2, "name": "alma" }, "count": 11 },
            { "theme": { "id": 6, "name": "asdsad" }, "count": 3 },
            { "theme": { "id": 7, "name": "ezigen" }, "count": 1 }
        ],
        "magyar": [
            { "theme": { "id": 3, "name": "gyász" }, "count": 8 }
        ],
        "történelem": [
            { "theme": { "id": 4, "name": "béka" }, "count": 8 }
        ]
    });

    mockAxios.onGet(`${BASE_URL}/erettsegizzunk/Tantargyak/get-tantargyak`).reply(200, [
      { id: 1, name: "matematika" },
      { id: 2, name: "történelem" },
      { id: 3, name: "magyar" },
    ]);

    render(
      <BrowserRouter>
        <SelectorComponent />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    expect(screen.getByText('matematika')).toBeInTheDocument();
    expect(screen.getByText('történelem')).toBeInTheDocument();
    expect(screen.getByText('magyar')).toBeInTheDocument();
  });

  it('should display the modal if saved exercises exist', async () => {
    mockAxios.onGet(`${BASE_URL}/erettsegizzunk/Themes/get-temak-feladatonkent`).reply(200, {});
    mockAxios.onGet(`${BASE_URL}/erettsegizzunk/Tantargyak/get-tantargyak`).reply(200, []);

    render(
      <BrowserRouter>
        <SelectorComponent />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Folytatni szeretnéd?')).toBeInTheDocument());
  });
});