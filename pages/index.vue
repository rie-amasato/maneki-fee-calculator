<template>
  <div class="container yellow">
    <p>部屋料金(税抜) <button @click="addRoomPrice">+</button></p>
    <ul>
      <li v-for="(room, i) in prices_room">
        <input
          :value="room['price_unit']"
          type="text"
          inputmode="numeric"
          @input="(e) => change_roomPrice(e, i, 'price_unit')"
        />円 ×
        <input
          :value="room['time_count']"
          type="text"
          inputmode="numeric"
          @input="(e) => change_roomPrice(e, i, 'time_count')"
        /> × 30分
      </li>
    </ul>
  </div>

  <div class="container yellow">
    <p>注文料金(税抜) <button @click="addOrderPrice">+</button></p>
    <ul>
      <li v-for="(order, i) in prices_order">
        <input
          :value="order"
          type="text"
          inputmode="numeric"
          @input="(e) => change_orderPrice(e, i)"
        />円
      </li>
    </ul>
  </div>

  <div class="container yellow">
    <p>
      会員ランク
      <select v-model="lank" @change="calcTotalPrice">
        <option v-for="item in lank_items" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </p>
  </div>

  <div class="container blue">
    <p>
      合計金額（税込）: <span class="big">{{ price_total }}</span
      >円
    </p>
    <p v-if="0 < price_nokori">
      1000円まであと（税抜） <span class="attention">{{ price_nokori }}</span
      >円
    </p>
  </div>
</template>

<style lang="css">
input[type="text"] {
  width: 20%;
}
.big {
  font-size: 48px;
}

.attention {
  font-weight: 700;
  font-size: 32px;
  color: #f55;
}
</style>

<script setup lang="ts">
const taxRate: number = 1.1;

onMounted(() => {
  calcTotalPrice();
});

const price_total = ref<number>(0);
const price_nokori = ref<number>(0);

type TRoomPrice = {
  price_unit: number;
  time_count: number;
};
const prices_room = ref<TRoomPrice[]>([{ price_unit: 50, time_count: 5 }]);
const addRoomPrice = () => {
  prices_room.value.push({ price_unit: 150, time_count: 1 });
  calcTotalPrice();
};
const change_roomPrice = (
  e: any,
  index: number,
  label: "price_unit" | "time_count"
) => {
  prices_room.value[index][label] = Number(
    e.target.value.replace(/[^0-9]/g, "")
  );
  calcTotalPrice();
};

const prices_order = ref<number[]>([382]);
const addOrderPrice = () => {
  prices_order.value.push(0);
  calcTotalPrice();
};
const change_orderPrice = (e: any, index: number) => {
  prices_order.value[index] = Number(e.target.value.replace(/[^0-9]/g, ""));
  calcTotalPrice();
};

const lank_items = ref<{
  [value: string]: { label: string; value: string; discount: number };
}>({
  No: { label: "ランクなし", value: "No", discount: 0 },
  Cu: { label: "ブロンズ", value: "Cu", discount: 5 },
  Ag: { label: "シルバー", value: "Ag", discount: 10 },
  Au: { label: "ゴールド", value: "Au", discount: 15 },
  Pt: { label: "プラチナ", value: "Pt", discount: 20 },
  C: { label: "ダイヤモンド", value: "C", discount: 30 },
});
const lank = ref<string>("Au");

const calcTotalPrice = () => {
  // 合計金額は税込価格からそのランク割引価格（切り捨て）を引いている
  let totalRoomPrice = 0;
  prices_room.value.forEach((price) => {
    totalRoomPrice += price.price_unit * price.time_count;
  });

  const totalOrderPrice = Number(
    prices_order.value.reduce((prev, curr) => {
      return Number(prev) + Number(curr);
    }, 0)
  );

  const totalIncludeTax = Math.floor(
    (totalRoomPrice + totalOrderPrice) * taxRate
  );
  const discountRate = lank_items.value[lank.value].discount / 100;
  const discount = Math.floor(totalIncludeTax * discountRate);

  price_total.value = totalIncludeTax - discount;

  const price_goal = 1000 / 1.1 / (1 - discountRate);
  price_nokori.value = Math.ceil(
    price_goal - (totalRoomPrice + totalOrderPrice)
  );
};
</script>
