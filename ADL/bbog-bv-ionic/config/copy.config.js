module.exports = {
  copyTimeAgoWebComponent: {
    src: ['{{ROOT}}/node_modules/@pulse.io/components/dist/pulse**/*'],
    dest: '{{BUILD}}'
  },
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/bv_service-worker.js'],
    dest: '{{WWW}}'
  },
}
