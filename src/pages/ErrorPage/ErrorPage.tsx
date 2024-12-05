import { Link } from 'react-router'
import './ErrorPage.scss'

function ErrorPage() {
  return (
    <>
    <h1>You kind of got lost! Want to see your commendations?</h1>
    <Link data-itemprop='url' to='/SoT-Tracker/commendations'>Commendations</Link>
    </>
  )
}

export default ErrorPage