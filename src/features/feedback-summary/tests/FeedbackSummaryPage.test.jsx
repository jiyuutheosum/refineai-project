import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../../app/store'
import FeedbackSummaryPage from '../pages/FeedbackSummaryPage'

test('renders feedback summary page', () => {
  render(
    <Provider store={store}>
      <FeedbackSummaryPage />
    </Provider>
  )
  expect(screen.getByText(/Feedback Summary/i)).toBeInTheDocument()
})

