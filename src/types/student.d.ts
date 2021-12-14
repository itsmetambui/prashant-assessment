interface Student {
  name: string;
  avatarURL: string;
  lecturesAttended: number;
  totalLectures: number;
  marks: {
    [key: string]: {
      subjectTitle: string;
      totalMarks: 100;
      markesObtained: 56;
    };
  };
}
