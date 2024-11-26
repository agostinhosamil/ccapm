type MeetMember = {
  id: string | number;
};

type MeetData = {
  id: string;
  started?: boolean;
  members: Array<MeetMember>;
};

type Data = {
  meets: Array<MeetData>;
};

const data: Data = {
  meets: [],
};

export const createMeet = async (id: string, started: boolean = false) => {
  if (data.meets.some((meet) => meet.id === id)) {
    return;
  }

  data.meets.push({ id, members: [], started });
};

export const getMeets = async () => data.meets;

export const getMeet = async (id: string) =>
  data.meets.find((meet) => meet.id === id);

export const updateMeet = async (id: string, meetData: Partial<MeetData>) => {
  data.meets = data.meets.map((meet) => {
    if (meet.id !== id) {
      return meet;
    }

    return {
      ...meet,
      ...meetData,
    };
  });
};

export const deleteMeet = async (id: string) => {
  data.meets = data.meets.filter((meet) => meet.id !== id);
};

export const addMeetMember = async (
  meetId: string,
  memberId: string | number
) => {
  const meet = await getMeet(meetId);

  if (!(meet && !meet.members.some((member) => member.id === memberId))) {
    return;
  }

  updateMeet(meetId, {
    members: [
      ...meet.members,
      {
        id: memberId,
      },
    ],
  });
};

export const meets = {
  all: getMeets,
  find: getMeet,
  create: createMeet,
  update: updateMeet,
  delete: deleteMeet,
  addMember: addMeetMember,
};

export default meets;
