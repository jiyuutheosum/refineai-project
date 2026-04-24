import ReduxProvider from './ReduxProvider'
import AppRoutes from '../router/Routes'

const AppProviders = () => {
  return (
    <ReduxProvider>
      <AppRoutes />
    </ReduxProvider>
  )
}

export default AppProviders

