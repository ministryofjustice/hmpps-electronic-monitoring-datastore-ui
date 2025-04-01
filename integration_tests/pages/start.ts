import AppPage from './appPage'
import paths from '../../server/constants/paths'

export default class StartPage extends AppPage {
  constructor() {
    super('Electronic Monitoring Datastore', paths.START)
  }
}
