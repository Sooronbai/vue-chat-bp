<template>
    <div class="chat-window" v-if="activeChatUser">
        <h3 class="chat-title">Чат с {{ activeChatUser.name }}</h3>
        <div class="messages">
            <div v-for="message in filteredMessages" :key="message.id" :class="[
                'message',
                message.from === selectedUser.id ? 'outgoing' : 'incoming',
            ]">
                <div class="message-text">{{ message.text }}</div>
                <small class="message-info">{{ getUserName(message.from) }} •
                    {{ new Date(message.timestamp).toLocaleTimeString() }}</small>
            </div>
        </div>
        <div class="input-container">
            <input :value="newMessage" @input="updateNewMessage" @keyup.enter="sendMessage"
                placeholder="Введите сообщение" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activeChatUser: Object,
        filteredMessages: Array,
        newMessage: String,
        selectedUser: Object,
        getUserName: Function,
        sendMessage: Function
    },
    methods: {
        updateNewMessage(event) {
            this.$emit('update:newMessage', event.target.value);
        },
    }
};
</script>


<style>
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