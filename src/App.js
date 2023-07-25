import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(null);
  function handleShowAddfriend() {
    setShowAddFriend(!showAddFriend);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelectFriend(friend) {
    setSelectedFriends((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleformsplit(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriends(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelectFriend}
          selectedFriend={selectedFriends}
        />
        {showAddFriend && <FormaddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddfriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriends && (
        <Formsplit
          selectedFriend={selectedFriends}
          onSplit={handleformsplit}
          key={selectedFriends.id}
        />
      )}
    </div>
  );
}
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul className="sidebar">
      {friends.map((friend) => (
        <Friend
          friends={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friends, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friends.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friends.image} alt={friends.name} />
      <h3>{friends.name}</h3>
      {friends.balance < 0 && (
        <p className="red">
          You owe {friends.name} ${friends.balance}
        </p>
      )}
      {friends.balance > 0 && (
        <p className="green">
          {friends.name} owe you ${friends.balance}
        </p>
      )}
      {friends.balance === 0 && (
        <p className="black">
          You owe {friends.name} ${friends.balance}
        </p>
      )}
      <Button onClick={() => onSelection(friends)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormaddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!image || !name) return;
    const id = crypto.randomUUID();
    const newItem = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newItem);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>✨ Achate </label>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> 🖼️ Image</label>
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function Formsplit({ selectedFriend, onSplit }) {
  const [billAmt, setBillAmt] = useState("");
  const [yourExp, setYourExp] = useState("");
  const fpay = billAmt ? billAmt - yourExp : "";
  const [upay, setUpay] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!billAmt || !yourExp) return;
    onSplit(upay === "user" ? fpay : -yourExp);
  }
  return (
    <form className="form-split-bill">
      <h2>Split the bill with {selectedFriend.name}</h2>
      <label>🤑Bill Value</label>
      <input
        type="text"
        placeholder="bill"
        value={billAmt}
        onChange={(e) => setBillAmt(Number(e.target.value))}
      />
      <label>💰Your expense</label>
      <input
        type="text"
        value={yourExp}
        onChange={(e) =>
          setYourExp(
            Number(e.target.value) > billAmt ? yourExp : Number(e.target.value)
          )
        }
      />
      <label>🤑{selectedFriend.name}'s expenses</label>
      <input type="text" value={fpay} disabled />
      <label>🤔 Whos paying bill?</label>
      <select value={upay} onChange={(e) => setUpay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button onClick={handleSubmit}>Split Bill</Button>
    </form>
  );
}
