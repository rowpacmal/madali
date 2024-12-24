import ListItem from '../../../ListItem';

const library = {
  createListItems: function (item, index, style) {
    return (
      <div className={style.liBody}>
        <ListItem label="Course Code">{item.id}</ListItem>

        <ListItem label="Name">{item.name}</ListItem>

        <ListItem label="Teacher">{item.teacherName}</ListItem>
      </div>
    );
  },
};

export default library;
