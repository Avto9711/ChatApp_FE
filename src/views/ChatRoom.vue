<template>
  <div class="home">
    <ChatRoom/>
  </div>
</template>

<script lang="ts">
import ChatRoom from '@/components/ChatRoom.vue'
export default {
  name: 'ChatRoomView',
  components: {
    ChatRoom
  }
}
</script>
