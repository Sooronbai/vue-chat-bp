<template>
  <div class="app">
    <div v-if="!selectedUser" class="select-user">
      <h3>Выберите пользователя</h3>
      <ul>
        <li v-for="user in users" :key="user.id">
          <button @click="selectUser(user)" class="user-btn">{{ user.name }}</button>
        </li>
      </ul>
    </div>

    <div v-else class="chat-container">

      <div class="sidebar">
        <h3>Ваши чаты</h3>
        <ul>
          <li v-for="user in otherUsers" :key="user.id">
            <button @click="openChat(user)" class="chat-btn">{{ user.name }}</button>
          </li>
        </ul>
      </div>


      <div class="chat-window" v-if="activeChatUser">
        <h3 class="chat-title">Чат с {{ activeChatUser.name }}</h3>
        <div class="messages">
          <div v-for="message in filteredMessages" :key="message.id"
            :class="['message', message.from === selectedUser.id ? 'outgoing' : 'incoming']">
            <div class="message-text">{{ message.text }}</div>
            <small class="message-info">{{ getUserName(message.from) }} • {{ new
              Date(message.timestamp).toLocaleTimeString() }}</small>
          </div>
        </div>
        <div class="input-container">
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Введите сообщение" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const users = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
      { id: 3, name: "User 3" },
    ];

    const selectedUser = ref(null);
    const activeChatUser = ref(null);
    const newMessage = ref("");
    const messages = ref({});

    const initMessages = () => {
      const storedMessages = localStorage.getItem("chat-messages");
      messages.value = storedMessages ? JSON.parse(storedMessages) : {};
    };

    const storeMessages = () => {
      localStorage.setItem("chat-messages", JSON.stringify(messages.value));
    };

    const selectUser = (user) => {
      selectedUser.value = user;
      initMessages();
    };

    const openChat = (user) => {
      activeChatUser.value = user;
    };

    const sendMessage = () => {
      if (!newMessage.value.trim() || !activeChatUser.value) return;

      const chatId = [selectedUser.value.id, activeChatUser.value.id].sort().join('-');
      const chatMessages = messages.value[chatId] || [];
      chatMessages.push({
        id: Date.now(),
        from: selectedUser.value.id,
        to: activeChatUser.value.id,
        text: newMessage.value,
        timestamp: new Date().toISOString(),
      });
      messages.value[chatId] = chatMessages;
      newMessage.value = "";

      storeMessages();
    };

    const otherUsers = computed(() =>
      users.filter((user) => user.id !== selectedUser.value?.id)
    );

    const filteredMessages = computed(() => {
      if (!activeChatUser.value || !selectedUser.value) return [];

      const chatId = [selectedUser.value.id, activeChatUser.value.id].sort().join('-');
      return messages.value[chatId] || [];
    });

    const getUserName = (userId) => {
      const user = users.find((user) => user.id === userId);
      return user ? user.name : "Неизвестный";
    };

    onMounted(() => {
      initMessages();
      window.addEventListener("storage", initMessages);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("storage", initMessages);
    });

    return {
      users,
      selectedUser,
      activeChatUser,
      otherUsers,
      newMessage,
      filteredMessages,
      selectUser,
      openChat,
      sendMessage,
      getUserName,
    };
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  background-color: #f0f2f5;
}

.app {
  display: flex;
  height: 100vh;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.select-user {
  margin: auto;
  text-align: center;
}

.user-btn,
.chat-btn {
  background-color: #0088cc;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  margin: 10px 0;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
}

.user-btn:hover,
.chat-btn:hover {
  background-color: #006f9c;
}

.chat-container {
  display: flex;
  width: 100%;
}

.sidebar {
  width: 300px;
  padding: 20px;
  background-color: #f0f4f8;
  border-right: 1px solid #ccc;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
}

.chat-title {
  margin: 0 0 20px;
  font-size: 1.5rem;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 15px;
}

.incoming {
  text-align: left;
}

.outgoing {
  text-align: right;
}

.message-text {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 70%;
}

.incoming .message-text {
  background-color: #e0e0e0;
  color: #333;
}

.outgoing .message-text {
  background-color: #0088cc;
  color: white;
}

.message-info {
  font-size: 0.8rem;
  color: #999;
}

.input-container {
  margin-top: 10px;
}

input {
  width: 100%;
  padding: 15px;
  border-radius: 20px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #0088cc;
}
</style>
