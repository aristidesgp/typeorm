import { entity } from "../../../src/future/postgres"

export enum Role {
  Admin,
  User,
}

export function EducationEmbed() {
  return entity({
    columns: {
      name: {
        type: "varchar",
      },
      skills: {
        type: "varchar",
      },
    },
    relations: {
      campusPhotos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
  })
}

export function ExpirienceEmbed() {
  return entity({
    columns: {
      name: {
        type: "varchar",
      },
      position: {
        type: "varchar",
      },
    },
    relations: {
      organizationPhotos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
  })
}

export function ProfileEmbed() {
  return entity({
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
    relations: {
      educationPhotos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
  })
}

export function WorkerProfileEmbed() {
  return entity({
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
    relations: {
      educationPhotos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
    embeds: {
      education: EducationEmbed(),
      expirience: ExpirienceEmbed(),
    },
  })
}

export function UserEntity() {
  return entity({
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
    relations: {
      avatar: {
        type: "many-to-one",
        inverse: "",
        reference: PhotoEntity,
      },
      photos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
    embeds: {
      profile: ProfileEmbed(),
    },
  })
}

export function WorkerEntity() {
  return entity({
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
    relations: {
      avatar: {
        type: "many-to-one",
        reference: PhotoEntity,
      },
      photos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
    embeds: {
      workerProfile: WorkerProfileEmbed(),
    },
  })
}

export function PhotoEntity() {
  return entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      filename: {
        type: "varchar",
        nullable: true,
      },
    },
    relations: {
      album: {
        type: "many-to-one",
        inverse: "photos",
        reference: AlbumEntity,
      },
    },
  })
}

export function AlbumEntity() {
  return entity({
    columns: {
      id: {
        type: "int",
      },
      name: {
        type: "varchar",
      },
    },
    relations: {
      photos: {
        type: "one-to-many",
        inverse: "album",
        reference: PhotoEntity,
      },
    },
  })
}
