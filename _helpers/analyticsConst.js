// ------------------------------- Chart 1: TeamLevelActionsCounts ------------------------------//

const teamLevelActionCounts = [
  {
    id: 1,
    month: "Apr 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 2,
    month: "May 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 2 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    teams: [
      { name: "Mobile App Team", assigned: 4, completed: 0 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    teams: [
      { name: "Mobile App Team", assigned: 1, completed: 2 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 5 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 0, completed: 2 },
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    teams: [
      { name: "Mobile App Team", assigned: 2, completed: 2 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 0, completed: 2 },
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    teams: [
      { name: "Mobile App Team", assigned: 2, completed: 2 },
      { name: "Superannuation Team", assigned: 0, completed: 0 },
      { name: "Insurance Team", assigned: 0, completed: 0 },
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    teams: [
      { name: "Mobile App Team", assigned: 1, completed: 1 },
      { name: "Superannuation Team", assigned: 0, completed: 0 },
      { name: "Insurance Team", assigned: 0, completed: 0 },
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 0, completed: 0 },
      { name: "Insurance Team", assigned: 1, completed: 1 },
    ],
  },
  {
    id: 14,
    month: "May 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    teams: [
      { name: "Mobile App Team", assigned: 2, completed: 2 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
];

// ------------------------------- Chart 2: EnterpriseLevelActionsCounts ------------------------------//

const allTeamsEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 25,
    completed: 20,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 41,
    completed: 36,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 35,
    completed: 35,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 30,
    completed: 21,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 22,
    completed: 26,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 57,
    completed: 52,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 89,
    completed: 99,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 67,
    completed: 67,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 78,
    completed: 78,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 77,
    completed: 45,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 73,
    completed: 70,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 89,
    completed: 80,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 95,
    completed: 99,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 82,
    completed: 65,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 88,
    completed: 34,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 91,
    completed: 23,
  },
];

const mobileTeamEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 10,
    completed: 3,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 13,
    completed: 14,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 12,
    completed: 15,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 12,
    completed: 7,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 7,
    completed: 3,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 27,
    completed: 32,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 14,
    completed: 33,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 23,
    completed: 45,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 15,
    completed: 34,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 34,
    completed: 12,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 45,
    completed: 25,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 45,
    completed: 51,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 19,
    completed: 23,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 24,
    completed: 37,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 34,
    completed: 16,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 41,
    completed: 4,
  },
];

const superannuationTeamEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 8,
    completed: 6,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 14,
    completed: 12,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 13,
    completed: 15,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 16,
    completed: 7,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 8,
    completed: 13,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 10,
    completed: 10,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 25,
    completed: 35,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 25,
    completed: 12,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 17,
    completed: 13,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 17,
    completed: 13,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 16,
    completed: 23,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 30,
    completed: 15,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 27,
    completed: 27,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 27,
    completed: 13,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 15,
    completed: 13,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 30,
    completed: 8,
  },
];

const insuranceTeamEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 7,
    completed: 11,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 14,
    completed: 10,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 10,
    completed: 5,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 2,
    completed: 7,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 7,
    completed: 10,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 20,
    completed: 10,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 50,
    completed: 31,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 19,
    completed: 10,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 45,
    completed: 31,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 26,
    completed: 20,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 12,
    completed: 22,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 14,
    completed: 14,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 49,
    completed: 49,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 31,
    completed: 15,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 39,
    completed: 5,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 20,
    completed: 11,
  },
];

// ------------------------------- Chart 3: ParticipantsCount ------------------------------//

const allTeamsParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 55,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 78,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 101,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 95,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 82,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 121,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 320,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 511,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 570,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 677,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 930,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 1211,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 1350,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 1265,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 1200,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 1321,
  },
];

const mobileTeamParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 19,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 19,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 32,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 43,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 33,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 37,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 56,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 180,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 209,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 319,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 479,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 571,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 589,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 476,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 543,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 593,
  },
];

const superannuationTeamParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 31,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 27,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 23,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 33,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 26,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 42,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 100,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 167,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 180,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 214,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 189,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 340,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 390,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 479,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 331,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 370,
  },
];

const insuranceTeamParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 5,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 32,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 46,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 19,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 23,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 42,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 164,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 164,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 181,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 144,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 262,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 300,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 371,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 310,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 326,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 358,
  },
];

// ------------------------------- Chart 4: Retros Counts ------------------------------//

const allTeamsSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 22,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 31,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 40,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 38,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 32,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 48,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 128,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 204,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 228,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 270,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 372,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 485,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 540,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 506,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 480,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 528,
  },
];

const mobileTeamSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 13,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 13,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 15,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 14,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 12,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 16,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 30,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 60,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 75,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 145,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 132,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 145,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 210,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 146,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 170,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 168,
  },
];

const superannuationTeamSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 5,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 12,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 10,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 14,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 10,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 12,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 50,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 80,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 75,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 60,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 150,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 150,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 140,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 156,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 145,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 170,
  },
];

const insuranceTeamSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 4,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 6,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 15,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 10,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 10,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 20,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 48,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 64,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 78,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 65,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 90,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 190,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 190,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 204,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 165,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 190,
  },
];

// ------------------------------- Chart 5: EnterpriseLevelSentimentSummary ------------------------------//

const allTeamsSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

const mobileTeamSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

const superannuationTeamSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

const insuranceTeamSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

// ------------------------------- Chart 6: EnterpriseLevelSentimentsTheme ------------------------------//

const allTeamsThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 60,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 70,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 50,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 40,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 65,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 59,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 45,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 60,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 55,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 75,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 55,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 35,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
};

const mobileTeamsThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 2,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 2,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 2,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 2,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 2,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 2,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 2,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 2,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 2,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 10,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 10,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 2,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 10,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 2,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 10,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 2,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 10,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 2,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 24,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 2,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 17,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 24,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 2,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 17,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 24,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 2,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 17,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 34,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 24,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 13,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 34,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 31,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 2,
        },
        {
          key: "Work Prioritisation",
          value: 24,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 17,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 32,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 31,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 34,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 24,
        },
        {
          key: "Individual & Team",
          value: 17,
        },
        {
          key: "People & Resources",
          value: 34,
        },
        {
          key: "Structure & Capabilities",
          value: 2,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 2,
        },
        {
          key: "Work Prioritisation",
          value: 10,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 34,
        },
        {
          key: "Work Technology & Tools",
          value: 13,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 24,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 32,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 17,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 24,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 13,
        },
        {
          key: "Work Prioritisation",
          value: 32,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 34,
        },
        {
          key: "Work Technology & Tools",
          value: 13,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 31,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 13,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 34,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 31,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 24,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 34,
        },
        {
          key: "Work Prioritisation",
          value: 10,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 24,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 34,
        },
        {
          key: "Decision Making",
          value: 10,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 31,
        },
        {
          key: "Individual & Team",
          value: 32,
        },
        {
          key: "People & Resources",
          value: 34,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 24,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 31,
        },
        {
          key: "Individual & Team",
          value: 32,
        },
        {
          key: "People & Resources",
          value: 34,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 24,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 31,
        },
        {
          key: "Individual & Team",
          value: 32,
        },
        {
          key: "People & Resources",
          value: 34,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 24,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 34,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 13,
        },
        {
          key: "Work Prioritisation",
          value: 10,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 2,
        },
        {
          key: "Work Technology & Tools",
          value: 17,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 17,
        },
        {
          key: "Work Prioritisation",
          value: 10,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 34,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 32,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 31,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 32,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 31,
        },
        {
          key: "Work Prioritisation",
          value: 32,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 34,
        },
        {
          key: "Openness to Feedback",
          value: 31,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 13,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 17,
        },
        {
          key: "Structure & Capabilities",
          value: 31,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 13,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 34,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 13,
        },
        {
          key: "Openness to Feedback",
          value: 13,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 17,
        },
        {
          key: "Individual & Team",
          value: 31,
        },
        {
          key: "People & Resources",
          value: 17,
        },
        {
          key: "Structure & Capabilities",
          value: 2,
        },
        {
          key: "Decision Making",
          value: 10,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 34,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 34,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 13,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 2,
        },
        {
          key: "Decision Making",
          value: 17,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
  ],
};

const superannuationTeamThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 3,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 3,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 3,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 3,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 3,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 3,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 3,
        },
        {
          key: "Work Prioritisation",
          value: 9,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 9,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 3,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 3,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 4,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 4,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 3,
        },
        {
          key: "People & Resources",
          value: 9,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 9,
        },
        {
          key: "Structure & Capabilities",
          value: 3,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 4,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 3,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 4,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 3,
        },
        {
          key: "People & Resources",
          value: 9,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 3,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 19,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 3,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 19,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 3,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 19,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 4,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 12,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 3,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 19,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 12,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 12,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 13,
        },
        {
          key: "Individual & Team",
          value: 19,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 3,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 3,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 16,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 13,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 4,
        },
        {
          key: "Work Prioritisation",
          value: 12,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 19,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 13,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 12,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 16,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 12,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 12,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 13,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 13,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 29,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 29,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 29,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 13,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 3,
        },
        {
          key: "Work Technology & Tools",
          value: 19,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 19,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 14,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 4,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 19,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 12,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 9,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 4,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 29,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 29,
        },
        {
          key: "Work Prioritisation",
          value: 12,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 12,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 9,
        },
        {
          key: "Work Technology & Tools",
          value: 16,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 19,
        },
        {
          key: "Structure & Capabilities",
          value: 12,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 9,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 9,
        },
        {
          key: "Structure & Capabilities",
          value: 4,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 9,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 19,
        },
        {
          key: "Individual & Team",
          value: 12,
        },
        {
          key: "People & Resources",
          value: 19,
        },
        {
          key: "Structure & Capabilities",
          value: 3,
        },
        {
          key: "Decision Making",
          value: 4,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 4,
        },
        {
          key: "Individual & Team",
          value: 9,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 4,
        },
        {
          key: "Work Technology & Tools",
          value: 9,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 4,
        },
        {
          key: "Structure & Capabilities",
          value: 3,
        },
        {
          key: "Decision Making",
          value: 19,
        },
        {
          key: "Openness to Feedback",
          value: 9,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
  ],
};

const insuranceTeamThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 28,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 28,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 28,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 12,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 28,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 12,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 12,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 28,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 26,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 12,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 12,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 28,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 12,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 12,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 28,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 26,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 14,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 28,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 26,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 12,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 12,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 12,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 12,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 28,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 12,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 28,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 12,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 12,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 28,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 12,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 28,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 14,
        },
        {
          key: "People & Resources",
          value: 12,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 28,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 12,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 5,
        },
        {
          key: "Openness to Feedback",
          value: 14,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 12,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 5,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 5,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 5,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 14,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 7145,
        },
        {
          key: "Work Prioritisation",
          value: 12,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 5,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 12,
        },
        {
          key: "Openness to Feedback",
          value: 12,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 16,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 12,
        },
        {
          key: "Decision Making",
          value: 16,
        },
        {
          key: "Openness to Feedback",
          value: 16,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 12,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 5,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 11,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 16,
        },
        {
          key: "Work Technology & Tools",
          value: 14,
        },
        {
          key: "Individual & Team",
          value: 12,
        },
        {
          key: "People & Resources",
          value: 14,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 11,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 12,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 11,
        },
        {
          key: "People & Resources",
          value: 16,
        },
        {
          key: "Structure & Capabilities",
          value: 16,
        },
        {
          key: "Decision Making",
          value: 12,
        },
        {
          key: "Openness to Feedback",
          value: 5,
        },
        {
          key: "Work Prioritisation",
          value: 16,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 11,
        },
        {
          key: "Work Technology & Tools",
          value: 11,
        },
        {
          key: "Individual & Team",
          value: 16,
        },
        {
          key: "People & Resources",
          value: 11,
        },
        {
          key: "Structure & Capabilities",
          value: 5,
        },
        {
          key: "Decision Making",
          value: 14,
        },
        {
          key: "Openness to Feedback",
          value: 11,
        },
        {
          key: "Work Prioritisation",
          value: 11,
        },
      ],
    },
  ],
};

// ------------------------------- Chart 7: EnterpriseLevelSentimentsMoods ------------------------------//
const allTeamsMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 5,
    neutral: 40,
    happy: 10,
  },
  {
    id: 2,
    month: "May 22",
    sad: 18,
    neutral: 20,
    happy: 40,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 20,
    neutral: 26,
    happy: 55,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 10,
    neutral: 31,
    happy: 54,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 12,
    neutral: 16,
    happy: 54,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 12,
    neutral: 42,
    happy: 47,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 45,
    neutral: 74,
    happy: 201,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 50,
    neutral: 28,
    happy: 433,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 43,
    neutral: 71,
    happy: 456,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 55,
    neutral: 114,
    happy: 508,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 60,
    neutral: 38,
    happy: 832,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 67,
    neutral: 133,
    happy: 1011,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 66,
    neutral: 239,
    happy: 1045,
  },
  {
    id: 14,
    month: "May 23",
    sad: 54,
    neutral: 211,
    happy: 1000,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 76,
    neutral: 24,
    happy: 1100,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 78,
    neutral: 115,
    happy: 1155,
  },
];

const mobileTeamMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 1,
    neutral: 13,
    happy: 5,
  },
  {
    id: 2,
    month: "May 22",
    sad: 2,
    neutral: 5,
    happy: 10,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 7,
    neutral: 12,
    happy: 13,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 3,
    neutral: 16,
    happy: 24,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 6,
    neutral: 3,
    happy: 24,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 6,
    neutral: 14,
    happy: 17,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 15,
    neutral: 30,
    happy: 11,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 34,
    neutral: 13,
    happy: 133,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 13,
    neutral: 40,
    happy: 156,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 5,
    neutral: 14,
    happy: 300,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 16,
    neutral: 13,
    happy: 450,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 27,
    neutral: 33,
    happy: 511,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 15,
    neutral: 29,
    happy: 545,
  },
  {
    id: 14,
    month: "May 23",
    sad: 35,
    neutral: 41,
    happy: 400,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 40,
    neutral: 3,
    happy: 500,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 13,
    neutral: 25,
    happy: 555,
  },
];

const superannuationTeamMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 2,
    neutral: 26,
    happy: 3,
  },
  {
    id: 2,
    month: "May 22",
    sad: 6,
    neutral: 6,
    happy: 15,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 5,
    neutral: 6,
    happy: 12,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 5,
    neutral: 13,
    happy: 15,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 3,
    neutral: 8,
    happy: 15,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 3,
    neutral: 14,
    happy: 25,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 25,
    neutral: 30,
    happy: 45,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 5,
    neutral: 12,
    happy: 150,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 20,
    neutral: 20,
    happy: 140,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 24,
    neutral: 50,
    happy: 140,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 24,
    neutral: 15,
    happy: 150,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 30,
    neutral: 60,
    happy: 250,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 30,
    neutral: 110,
    happy: 250,
  },
  {
    id: 14,
    month: "May 23",
    sad: 9,
    neutral: 70,
    happy: 400,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 26,
    neutral: 5,
    happy: 300,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 25,
    neutral: 45,
    happy: 300,
  },
];

const insuranceTeamMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 2,
    neutral: 1,
    happy: 2,
  },
  {
    id: 2,
    month: "May 22",
    sad: 8,
    neutral: 9,
    happy: 15,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 8,
    neutral: 8,
    happy: 30,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 2,
    neutral: 2,
    happy: 15,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 3,
    neutral: 5,
    happy: 15,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 3,
    neutral: 14,
    happy: 25,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 5,
    neutral: 14,
    happy: 145,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 11,
    neutral: 3,
    happy: 150,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 10,
    neutral: 11,
    happy: 160,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 26,
    neutral: 50,
    happy: 68,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 20,
    neutral: 10,
    happy: 232,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 10,
    neutral: 40,
    happy: 250,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 21,
    neutral: 100,
    happy: 250,
  },
  {
    id: 14,
    month: "May 23",
    sad: 10,
    neutral: 100,
    happy: 200,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 10,
    neutral: 16,
    happy: 300,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 13,
    neutral: 45,
    happy: 300,
  },
];

module.exports = {
  teamLevelActionCounts,
  allTeamsEnterpriseActionsResult,
  mobileTeamEnterpriseActionsResult,
  superannuationTeamEnterpriseActionsResult,
  insuranceTeamEnterpriseActionsResult,
  allTeamsParticipantResult,
  mobileTeamParticipantResult,
  superannuationTeamParticipantResult,
  insuranceTeamParticipantResult,
  allTeamsSessionResult,
  mobileTeamSessionResult,
  superannuationTeamSessionResult,
  insuranceTeamSessionResult,
  allTeamsSummaryResult,
  mobileTeamSummaryResult,
  superannuationTeamSummaryResult,
  insuranceTeamSummaryResult,
  allTeamsThemeResult,
  mobileTeamsThemeResult,
  superannuationTeamThemeResult,
  insuranceTeamThemeResult,
  allTeamsMoodResult,
  mobileTeamMoodResult,
  superannuationTeamMoodResult,
  insuranceTeamMoodResult,
};
