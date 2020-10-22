import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

let patch = init([
  styleModule,
  eventListenersModule
])

let heroes = [
  { id: 1, name: "剑圣", age: 80, elmHeight: 0, offsetTop: 0 },
  { id: 2, name: "盲僧", age: 30, elmHeight: 0, offsetTop: 0 },
  { id: 3, name: "暗夜猎手", age: 50, elmHeight: 0, offsetTop: 0 },
  { id: 4, name: "寒冰射手", age: 20, elmHeight: 0, offsetTop: 0 },
  { id: 5, name: "赏金猎人", age: 40, elmHeight: 0, offsetTop: 0 }
];

let lastId = heroes[heroes.length - 1] ? heroes[heroes.length - 1].id + 1 : 1;

let oldVnode = null;
function render(data) {
  data.reduce((arr, hero) => {
    let last = arr[arr.length - 1];
    hero.offsetTop = last ? last.offsetTop + last.elmHeight + 10 : 10;
    return arr.concat(hero);
  }, []);

  oldVnode = patch(oldVnode, view(heroes));
}

function view(data) {
  return h("div.main", [
    h("div.btn-group", [
      h("div.btn.add", { on: { click: add } }, "增加"),
      h("div.btn.sort", { on: { click: sort } }, "排序")
    ]),
    h("div.content", [
      h(
        "ul",
        heroes.map((hero) => {
          return h(
            "li.hero",
            {
              key: hero.id,
              hook: {
                insert: (vnode) => {
                  hero.elmHeight = vnode.elm.offsetHeight;
                }
              },
              style: {
                opacity: 0,
                transform: `translateY(0px)`,
                delayed: {
                  opacity: 1,
                  transform: `translateY(${hero.offsetTop}px)`
                },
                remove: {
                  opacity: 0,
                  transform: `translateX(0px)`
                }
              }
            },
            [
              h("div", [
                h(
                  "span.left",
                  {
                    style: {
                      destroy: {
                        color: "red"
                      }
                    }
                  },
                  "姓名：" + hero.name
                ),
                h(
                  "span.left.l30",
                  {
                    style: {
                      destroy: {
                        color: "blue"
                      }
                    }
                  },
                  "年龄：" + hero.age
                ),
                h("span.right.close", { on: { click: [closeX, hero.id] } }, "x")
              ])
            ]
          );
        })
      )
    ])
  ]);
}

function add() {
  lastId++;
  heroes.unshift({
    name: Math.floor(Math.random() * 10000)
      .toString(16)
      .substr(0, 2),
    age: Math.floor(Math.random() * 100),
    id: lastId,
    elmHeight: 42,
    offsetTop: 10
  });
  render(heroes);
}
function sort() {
  heroes = heroes.sort((a, b) => {
    return a.age - b.age;
  });
  render(heroes);
}
function closeX(id) {
  heroes = heroes.filter((hero) => {
    if (hero.id !== id) {
      return hero;
    }
    return null;
  });
  render(heroes);
}

let app = document.querySelector("#app");
oldVnode = patch(app, view(heroes));
render(heroes)
