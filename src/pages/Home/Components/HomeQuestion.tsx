import './HomeQuestion.scss'

type HomeQuestionProps = {
  title: string
  content: React.ReactNode
}

const HomeQuestion = ({ title, content }: HomeQuestionProps) => (
  <div className='home-question'>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
)

export default HomeQuestion