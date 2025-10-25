import './Home.scss'
import HomeQuestion from "./Components/HomeQuestion"


function Home() {
  return (
    <>
    <div className="homepage">
      <h1>SoT Tracker - A commendations companion app, because the in-game one is a mess</h1>
      {/* <h2>This page is under construction - check out the Commendations page!</h2> */}

      {/* One day, I'll add a carousel here with some cool pics. One day. Not today. */}
      
      <HomeQuestion 
      title="What is this website?" 
      content="SoT Tracker is a custom way to browse your Sea of Thieves commendations. 
      I originally built it for myself as a way to have all my commendations be displayed on a single page, ordered, organized, with filter and search options, 
      and displaying what each of them unlocks. Since the game couldn't provide half these features, I made them myself."
      />  
      <HomeQuestion
      title="Why bother, when in-game menus exists?"
      content="Again, the in-game menus doesn't have filtering, search bars, and doesn't say what they unlock. And I wanted a tool that's quick, responsive and easy to use while you're in-game."
      />
      <HomeQuestion
      title="How does it even work?"
      content="You create an account on this website, and then import your 'rat' token from the Sea of Thieves website - gives the website a 
      read-only access to your game progress (levels, commendations, monthly ledger unlocks). No data of yours is kept in the databases, 
      would you delete your SoT Tracker account. Everything is open-source, so if you can read code, you'll find the GitHub repos below."
      />

      <HomeQuestion
      title="What does it look like?"
      content={
        <>
        See a couple screenshots{' '}
        <a
          href="https://imgur.com/a/sot-tracker-25-10-25-preview-fBANLxu"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        , or try a demo page here (coming soon!).
        </>
      }
      />
      <HomeQuestion
      title='Why use the "rat" token and not an importer like other fan websites?'
      content='This website was originally built to meet my own needs - as a companion app while playing. 
      While an importer would work just as well, it requires more steps: open the SoT website profile page, run the script, 
      go back to the tracker and refresh. By using the "rat" token instead, a single click on the "refresh" button here is enough to refresh everything, which is far more convenient.'
      />
      <HomeQuestion
      title="Does this website work on mobile? / Is an app planned?"
      content="Though it's not a priority right now since not all the core features are implemented, this is definitely something I plan to do eventually - especially for console players."
      />
      <HomeQuestion
        title="Let me see the code!"
        content={
          <>
            Yup. You can find it on the website's footer at any time, or here:{' '}
            <a href="https://github.com/Hyrull/SoT-Tracker"
              target="_blank" rel="noopener noreferrer">
              frontend code</a>
            ,{' '}
            <a href="https://github.com/Hyrull/SoT-Tracker-backend"
              target="_blank" rel="noopener noreferrer">
              backend code</a>.
          </>
        }
      />
      <HomeQuestion
      title="I have feedback."
      content="Either send an issue on the repos above, or ping me on any Sea of Thieves Discord server I'm on (I'm on most). I'm @hyrul."
      />
    </div>
    </>

  )
}

export default Home