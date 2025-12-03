/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { queryClient } from '../api/queryClient';

test('renders correctly', async () => {
  jest.useFakeTimers()
  let renderer: ReactTestRenderer.ReactTestRenderer
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />)
  })
  await ReactTestRenderer.act(async () => {
    renderer.unmount()
  })
  queryClient.clear()
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
});
