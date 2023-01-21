const capitalizaFirstLetter = (s) => {
    return s.toLowerCase().charAt(0).toUpperCase() + s.slice(1);
};

module.exports = {
    capitalizaFirstLetter,
};
