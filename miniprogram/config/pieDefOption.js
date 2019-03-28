export default {
  backgroundColor: 'transparent',

  tooltip: {
    trigger: 'item',
    formatter: '{b}  {a}: {c} 小时 ({d}%)'
  },

  visualMap: {
    show: false,
    min: 0,
    max: 8,
    inRange: {
        colorLightness: [0.8, 0.46]
    }
},
  series: [
    {
      name: '累计',
      type: 'pie',
      radius: '70%',
      center: ['50%', '50%'],
      data: [
        { value: 0, name: '暂无数据' }
      ],
      roseType: 'radius',
      label: {
        normal: {
          textStyle: {
            color: 'rgba(0, 0, 0, 0.6)'
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          length: 10,
          length2: 10
        }
      },
      itemStyle: {
        normal: {
          color: '#039be5'
        }
      },

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function(idx) {
        return Math.random() * 200
      }
    }
  ]
}
