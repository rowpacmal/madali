import Management from '../../Management';
import library from './library';

function TeacherTab() {
  return (
    <section>
      <header>
        <h2>Teacher</h2>
      </header>

      <Management list={[]} library={library} isManager />
    </section>
  );
}

export default TeacherTab;
