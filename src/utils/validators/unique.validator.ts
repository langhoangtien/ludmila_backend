// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
// } from 'class-validator';
// import { Injectable } from '@nestjs/common';

// import { DataSource } from 'typeorm';

// import { InjectDataSource } from '@nestjs/typeorm';

// type ValidationEntity =
//   | {
//       id?: number | string;
//     }
//   | undefined;

// @ValidatorConstraint({ name: 'Unique', async: true })
// @Injectable()
// export class UniqueConstraint implements ValidatorConstraintInterface {
//   constructor(
//     @InjectDataSource()
//     private dataSource: DataSource,
//   ) {}

//   async validate(value: any, args: ValidationArguments): Promise<boolean> {
//     const [repository, property, exceptField = null] = args.constraints;
//     console.log('REPO', repository, property, exceptField);

//     if (!value || !repository) return false;

//     // const record = await this.dataSource.getRepository(repository).findOne({
//     //   where: {
//     //     [property]: value,
//     //   },
//     // });
//     const record = (await this.dataSource.getRepository(repository).findOne({
//       where: {
//         [property]: value,
//       },
//     })) as ValidationEntity;

//     if (record === undefined) return true;
//     if (record === null) return true;

//     if (!exceptField) return false;

//     const exceptFieldValue = (args.object as any)[exceptField];
//     if (!exceptFieldValue) return false;

//     return record[exceptField] === exceptFieldValue;
//   }

//   defaultMessage(args: ValidationArguments) {
//     return `${args.property} entered is not valid`;
//   }
// }

// export function Unique(
//   repository: string,
//   uniqueField: string,
//   exceptField: string | null,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [repository, uniqueField, exceptField],
//       validator: UniqueConstraint,
//     });
//   };
// }
