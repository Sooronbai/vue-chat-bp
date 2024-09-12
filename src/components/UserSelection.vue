<template>
    <div class="select-user">
        <h3>Выберите пользователя</h3>
        <ul>
            <li v-for="user in users" :key="user.id">
                <button @click="selectUser(user)" class="user-btn">
                    {{ user.name }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        users: Array,
        selectUser: Function
    }
};
</script>

<style>
.select-user {
    margin: auto;
    text-align: center;
}
</style>