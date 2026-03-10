export const users = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey bro!",
    online: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Let's meet tomorrow",
    online: false,
  },
  {
    id: 3,
    name: "Rahul Verma",
    avatar: "https://i.pravatar.cc/150?img=8",
    lastMessage: "Project done?",
    online: true,
  },
];

export const messages = {
  1: [
    { id: 1, text: "Hello 👋", sender: "other" },
    { id: 2, text: "Hi bro!", sender: "me" },
  ],
  2: [
    { id: 1, text: "Meeting at 5?", sender: "other" },
    { id: 2, text: "Okay 👍", sender: "me" },
  ],
  3: [
    { id: 1, text: "Did you complete UI?", sender: "other" },
    { id: 2, text: "Almost done", sender: "me" },
  ],
};