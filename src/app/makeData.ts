import { build, fake, sequence } from "test-data-bot";

const adorableAvatarApi = "https://i.pravatar.cc";

const studentBuilder = build("Student")
  .fields({
    name: fake((f) => f.name.findName()),
    lecturesAttended: fake((f) => f.random.number({ min: 0, max: 30 })),
    totalLectures: fake((f) => f.random.number({ min: 0, max: 30 })),
  })
  .map((student) => ({
    ...student,
    avatarURL: `${adorableAvatarApi}/60?u=${student.name}`,
  }));

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...studentBuilder(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
