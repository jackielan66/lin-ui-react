// import svgo from 'svgo'

// const svgoPlugins = svgo.extendDefaultPlugins({

// })

module.exports = {
    multipass: true, // boolean. false by default
    // datauri: 'enc', // 'base64', 'enc' or 'unenc'. 'base64' by default
    // js2svg: {
    //   indent: 2, // string with spaces or number of spaces. 4 by default
    //   pretty: true, // boolean, false by default
    // },
    plugins: [
      {
        name: 'removeAttrs',
        attrs: ['style', 'fill','fill-rule']
      },
    ],
  };