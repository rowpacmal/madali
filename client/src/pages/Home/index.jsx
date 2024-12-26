import style from './style.module.css';

// This is a placeholder component for the home page.
function Home() {
  return (
    <>
      <header className={style.header}>
        <h2>Welcome to Madali – The Ultimate Learning Companion!</h2>
      </header>

      <div className={style.container}>
        <p>
          Madali is your all-in-one educational app designed to make learning
          fun, engaging, and rewarding for kids while empowering teachers to
          track and support their progress effortlessly.
        </p>

        <div>
          <p>With Madali, students can:</p>

          <p>
            Track Their Achievements: Monitor their learning journey and
            celebrate milestones.
          </p>

          <p>
            Earn Badges: Unlock exciting badges for mastering skills, completing
            tasks, and excelling in challenges.
          </p>
        </div>

        <div>
          <p>For teachers, Madali provides:</p>

          <p>
            Detailed Insights: Stay on top of individual and class performance
            with real-time updates.
          </p>
        </div>

        <p>
          Together, let’s make education more interactive, motivating, and
          personalized!
        </p>
      </div>
    </>
  );
}

export default Home;
