import { Link } from 'react-router'
import './ErrorPage.scss'

function ErrorPage() {
  return (
    <>
    <h1>You kind of got lost! Wanted to see your <Link data-itemprop='url' to='/commendations'>commendations</Link>?</h1>
    </>
  )
}

export default ErrorPage