module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/" // Engedélyezd az axios transpilálását
    ]
};