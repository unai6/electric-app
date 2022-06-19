<script setup>
import { onMounted, reactive } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import DataCard from '@/components/widgets/DataCard.vue'

// import i18n from '@/lang/i18n'
import { useToast } from 'vue-toastification'

import { Line as LineChart } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

import axios from 'axios'
import dayjs from 'dayjs'

Chart.register(...registerables)

// const { n, d }  = i18n.global || i18n

const toast = useToast()

const state = reactive({
  balanceData: {},
  renewables: {},
  notRenewables: {},
  demand: {},
  chartOptions: {
    pointBackgroundColor: 'transparent',
    responsive: true,
    borderWidth: 3,
    layout: {
      padding: 30,
    },
  },
  isLoading: true,
})


const date = reactive({
  start: '',
  end: '',
  timeTrunc: 'daily',
})

onMounted(async () => await fetchBalanceData('day'))

async function fetchBalanceData (timeTrunc) {
  switch (timeTrunc) {
    case 'day': {
      date.start = dayjs().subtract(6, 'day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    case 'month': {
      date.start = dayjs().startOf('month').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    default: {
      // This will apply to daily stats
      date.start = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
  }
  try {
    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date=${date.start}&end_date=${date.end}&time_trunc=${timeTrunc}`)
    state.balanceData = data
    const [renewables, notRenewables, demand] = state.balanceData.included
    state.renewables = renewables
    state.notRenewables = notRenewables
    state.demand = demand
  } catch (err) {
    console.error(err)
      toast.error('Ha habido un error al procesar los datos. Por favor vuelve a intentarlo.')
  } finally {
    state.isLoading = false
  }
}

/**  return {
    labels: date.timeTrunc === 'daily' ? hours : days,
    datasets: [
      {
        label: spot.attributes.title,
        data: date.timeTrunc === 'daily' ? spot.attributes.values.map(attribute => attribute.value) : Object.values(getCollectionValues(spot)),
        backgroundColor: spot.attributes.color,
        borderColor: spot.attributes.color,
        fill: false,
      },
      {
        label: pvpc.attributes.title,
        data: date.timeTrunc === 'daily' ? pvpc.attributes.values.map(attribute => attribute.value) : Object.values(getCollectionValues(pvpc)),
        backgroundColor: pvpc.attributes.color,
        borderColor: pvpc.attributes.color,
        fill: false,
      },
    ],
  } */

  function getChart (eneryTypeAttributes) {
    console.info(eneryTypeAttributes)
    return {
      labels: eneryTypeAttributes.attributes.values.map(att => dayjs(att.datetime).format('D MMM')),
      datasets: [
        {
          label: eneryTypeAttributes.attributes.title,
          data: eneryTypeAttributes.attributes.values.map(att => att.value),
          borderColor: eneryTypeAttributes.attributes.color,
          backgroundColor: eneryTypeAttributes.attributes.color,
        },
      ],
    }
  }
</script>

<template>
  <div class="market grid grid--12cols">
    <base-loader v-if="state.isLoading" />
    <div v-else>
      <h1>{{ state.balanceData.data.attributes.title }}</h1>
      <div class="grid grid--3cols">  
        <data-card :title="state.renewables.type">
          <div v-for="attribute in state.renewables.attributes.content" :key="attribute.type">
            <line-chart
              css-classes="insular-chart__chart"
              :chart-data="getChart(attribute)"
              :chart-options="state.chartOptions"
              :height="350"
            /> 
          </div>
        </data-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
</style>