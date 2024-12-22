import ListItem from '../../../ListItem';

const library = {
  createListItems: function (item, index, style) {
    return (
      <div className={style.liBody}>
        <ListItem label="Wallet Address">{item.id}</ListItem>

        <ListItem label="Full Name">
          {item.firstName} {item.lastName}
        </ListItem>

        <ListItem label="Class">{item.classID}</ListItem>
      </div>
    );
  },
};

export default library;
