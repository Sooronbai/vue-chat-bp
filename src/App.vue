<template>
  <div class="app">
    <UserSelection
      v-if="!selectedUser"
      :users="users"
      :selectUser="selectUser"
    />

    <div v-else class="chat-container">
      <Sidebar :otherUsers="otherUsers" :openChat="openChat" />

      <ChatWindow
        v-if="activeChatUser"
        :activeChatUser="activeChatUser"
        :filteredMessages="filteredMessages"
        @sendMessage="sendMessage"
        :selectedUser="selectedUser"
        :getUserName="getUserName"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { users } from "./users";
import { getUserName, generateChatId } from "./utils";
import { getFromStorage, saveToStorage } from "./localStorage";
import UserSelection from "./components/UserSelection.vue";
import Sidebar from "./components/Sidebar.vue";
import ChatWindow from "./components/ChatWindow.vue";

export default {
  components: {
    UserSelection,
    Sidebar,
    ChatWindow,
  },
  setup() {
    const selectedUser = ref(null);
    const activeChatUser = ref(null);
    const messages = ref({});

    const initMessages = () => {
      const storedMessages = getFromStorage("chat-messages");
      messages.value = storedMessages || {};
    };

    const storeMessages = () => {
      saveToStorage("chat-messages", messages.value);
    };

    const selectUser = (user) => {
      selectedUser.value = user;
      initMessages();
    };

    const openChat = (user) => {
      activeChatUser.value = user;
    };

    const sendMessage = (newMessage) => {
      if (!activeChatUser.value) return;

      const chatId = generateChatId(
        selectedUser.value.id,
        activeChatUser.value.id
      );
      const chatMessages = messages.value[chatId] || [];
      chatMessages.push({
        id: Date.now(),
        from: selectedUser.value.id,
        to: activeChatUser.value.id,
        text: newMessage,
        timestamp: new Date().toISOString(),
      });
      messages.value[chatId] = chatMessages;

      storeMessages();
    };

    const otherUsers = computed(() =>
      users.filter((user) => user.id !== selectedUser.value?.id)
    );

    const filteredMessages = computed(() => {
      if (!activeChatUser.value || !selectedUser.value) return [];

      const chatId = generateChatId(
        selectedUser.value.id,
        activeChatUser.value.id
      );
      return messages.value[chatId] || [];
    });

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
      filteredMessages,
      selectUser,
      openChat,
      sendMessage,
      getUserName: (userId) => getUserName(userId, users),
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
</style>
