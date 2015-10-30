/**
 * Created by zweizwei on 30/10/15.
 */
'use strict';

requirejs.config({
  baseUrl: 'js'
});

require([
  'gallery',
  'review',
  'game',
  // NB! Модули, которые ничего не возвращают, а только исполняют код,
  // тоже можно подключать, но главное делать это в конце списка, чтобы
  // не объявлять им имя в параметрах.
  'game_demo',
  'reviews',
  'form'
]);

