<template>
    <div class="sidebar">
        <h3>Ваши чаты</h3>
        <ul>
            <li v-for="user in otherUsers" :key="user.id">
                <button @click="openChat(user)" class="chat-btn">
                    {{ user.name }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        otherUsers: Array,
        openChat: Function
    }
};
</script>

<style>
.sidebar {
    width: 300px;
    padding: 20px;
    background-color: #f0f4f8;
    border-right: 1px solid #ccc;
}
</style>