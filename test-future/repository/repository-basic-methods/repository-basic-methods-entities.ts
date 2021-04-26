import { Postgres } from "../../../src/future/postgres"

export enum Role {
  Admin,
  User,
}

export function ProfileEmbed() {
  return Postgres.entity({
    columns: {
      bio: {
        type: "varchar",
      },
      maritalStatus: {
        type: "varchar",
      },
      adult: {
        type: "boolean",
      },
      kids: {
        type: "int",
      },
    },
  })
}

export function UserEntity() {
  return Postgres.entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
        primary: true,
      },
      active: {
        type: "boolean",
      },
      phones: {
        type: "varchar",
        // array: true,
      },
    },
    embeds: {
      profile: ProfileEmbed(),
    },
  })
}

export function WorkerProfilePrimary() {
  return Postgres.entity({
    columns: {
      bio: {
        type: "varchar",
        primary: true,
      },
      maritalStatus: {
        type: "varchar",
        primary: true,
      },
      adult: {
        type: "boolean",
      },
      kids: {
        type: "int",
      },
    },
  })
}

export function WorkerEntity() {
  return Postgres.entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
      },
      active: {
        type: "boolean",
      },
      phones: {
        type: "varchar",
        array: true,
      },
    },
    embeds: {
      workerProfile: WorkerProfilePrimary(),
    },
  })
}

export function EmployerProfileEmbed() {
  return Postgres.entity({
    columns: {
      bio: {
        type: "varchar",
        primary: true,
      },
      maritalStatus: {
        type: "varchar",
      },
      adult: {
        type: "boolean",
      },
      kids: {
        type: "int",
      },
    },
  })
}

export function EmployerEntity() {
  return Postgres.entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
      },
      active: {
        type: "boolean",
      },
      phones: {
        type: "varchar",
        array: true,
      },
    },
    embeds: {
      employerProfile: EmployerProfileEmbed(),
    },
  })
}

export function EducationEmbed() {
  return Postgres.entity({
    columns: {
      name: {
        type: "varchar",
        primary: true,
      },
      maritalStatus: {
        type: "varchar",
      },
      adult: {
        type: "boolean",
      },
      kids: {
        type: "int",
      },
    },
  })
}

export function StudentProfileEmbed() {
  return Postgres.entity({
    columns: {
      bio: {
        type: "varchar",
        primary: true,
      },
      maritalStatus: {
        type: "varchar",
      },
      adult: {
        type: "boolean",
      },
      kids: {
        type: "int",
      },
    },
    embeds: {
      education: EducationEmbed(),
    },
  })
}

export function StudentEntity() {
  return Postgres.entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
      },
      active: {
        type: "boolean",
      },
      phones: {
        type: "varchar",
        array: true,
      },
    },
    embeds: {
      studentProfile: StudentProfileEmbed(),
    },
  })
}
