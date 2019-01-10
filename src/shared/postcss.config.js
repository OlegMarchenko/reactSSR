module.exports = {
    plugins: [
        require("autoprefixer")({
            browsers: [
                "last 2 versions",
                "> 1%",
                "bb 10",
                "android 4"
            ]
        }),
        require("lost")
    ]
};