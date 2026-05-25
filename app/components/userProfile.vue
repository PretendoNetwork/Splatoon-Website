<script setup lang="ts">
import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info';

const { user } = defineProps<{
	user: FriendInfoWiiU;
}>();
</script>

<template>
  <Settings
    theme=""
    width="0px"
    height="380px"
  >
    <div class="card-list">
      <PlayingCard
        :index="0"
        :title="user.nnaInfo?.principalBasicInfo?.mii?.name ?? 'Unknown'"
        :level="23"
        rank="C+"
        icon="https://media.discordapp.net/attachments/638541370478297088/1491084143315128391/post.png?ex=69f01d12&is=69eecb92&hm=f1433884ee5e7e194a989c36836d4c6dca4f103c7db1e268a6883079524cbcad&=&format=webp&quality=lossless"
      >
        <h4>Turf Inked</h4>
        <span>193,200p</span>
        <h4>Total Wins</h4>
        <span>97</span>
      </PlayingCard>
      <PlayingCard
        :index="1"
        title="Splat Dualies"
        icon="https://cdn.wikimg.net/en/splatoonwiki/images/e/e8/S3_Weapon_Main_Splat_Dualies.png"
      />
      <PlayingCard
        :index="2"
        title="Retro Specs"
        icon="https://cdn.wikimg.net/en/splatoonwiki/images/2/22/S3_Gear_Headgear_Retro_Specs.png"
      />
      <PlayingCard
        :index="3"
        title="Forge Octarian Jacket"
        icon="https://cdn.wikimg.net/en/splatoonwiki/images/c/cf/S3_Gear_Clothing_Forge_Octarian_Jacket.png"
      />
      <PlayingCard
        :index="4"
        title="Green Rain Boots"
        icon="https://cdn.wikimg.net/en/splatoonwiki/images/e/e8/S3_Gear_Shoes_Green_Rain_Boots.png"
      />
    </div>
  </Settings>
</template>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 100%;
  height: 350px;
  margin: 0;
  padding: 30px;
  list-style: none;
}
</style>
