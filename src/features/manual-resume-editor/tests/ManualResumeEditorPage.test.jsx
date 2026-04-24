import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../../app/store'
import ManualResumeEditorPage from '../pages/ManualResumeEditorPage'

test('renders manual editor page', () => {
  render(
    <Provider store={store}>
      <ManualResumeEditorPage />
    </Provider>
  )
  expect(screen.getByText(/Resume Editor/i)).toBeInTheDocument()
})

