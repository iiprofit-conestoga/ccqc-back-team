import { Sequelize } from "sequelize";
import * as models from "./models";
import * as config from "./config/config";

// sequelize instance for customer db
const dbConfig = config.config.Development;
const orm = new Sequelize({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  dialect: "postgres",
  dialectOptions: {
    connectionTimeout: 1000,
    allowPublicKeyRetrieval: true,
  },
  logging: dbConfig.env === "development" ? true : false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

// Initialize models
const UserProfile = models.UserProfileFactory(orm);
const UserAuthentication = models.UserAuthenticationFactory(orm);
const PermissionMaster = models.PermissionMasterFactory(orm);
const RoleMaster = models.RoleMasterFactory(orm);
const RolePermissionRelation = models.RolePermissionRelationFactory(orm);

// Define relationships

// User Authentication Table Relations
UserProfile.hasMany(UserAuthentication, { foreignKey: "createdBy" });
UserAuthentication.belongsTo(UserProfile, {
  foreignKey: "createdBy",
  as: "createdByProfile",
});

UserProfile.hasMany(UserAuthentication, { foreignKey: "modifiedBy" });
UserAuthentication.belongsTo(UserProfile, {
  foreignKey: "modifiedBy",
  as: "modifiedByProfile",
});

UserProfile.hasMany(UserAuthentication, { foreignKey: "userinfo" });
UserAuthentication.belongsTo(UserProfile, {
  foreignKey: "userinfo",
  as: "userInfoProfile",
});

RoleMaster.hasMany(UserAuthentication, { foreignKey: "role_id" });
UserAuthentication.belongsTo(RoleMaster, {
  foreignKey: "role_id",
  as: "roleProfile",
});

// Permission Master Table Relations

UserProfile.hasMany(PermissionMaster, { foreignKey: "createdBy" });
PermissionMaster.belongsTo(UserProfile, {
  foreignKey: "createdBy",
  as: "createdByProfile",
});

UserProfile.hasMany(PermissionMaster, { foreignKey: "modifiedBy" });
PermissionMaster.belongsTo(UserProfile, {
  foreignKey: "modifiedBy",
  as: "modifiedByProfile",
});


// role permission relation Table 

UserProfile.hasMany(RolePermissionRelation, { foreignKey: "createdBy" });
RolePermissionRelation.belongsTo(UserProfile, {
  foreignKey: "createdBy",
  as: "createdByProfile",
});

UserProfile.hasMany(RolePermissionRelation, { foreignKey: "modifiedBy" });
RolePermissionRelation.belongsTo(UserProfile, {
  foreignKey: "modifiedBy",
  as: "modifiedByProfile",
});

RoleMaster.hasMany(RolePermissionRelation, { foreignKey: "role_id" });
RolePermissionRelation.belongsTo(RoleMaster, {
  foreignKey: "role_id",
  as: "roleRelationProfile",
});

PermissionMaster.hasMany(RolePermissionRelation, { foreignKey: "permission_id" });
RolePermissionRelation.belongsTo(PermissionMaster, {
  foreignKey: "permission_id",
  as: "permissionRelationProfile",
});


const ProjectDB = {
  orm,
  UserProfile,
  UserAuthentication,
  PermissionMaster,
  RoleMaster,
  RolePermissionRelation,
};

export { ProjectDB, orm as ormProject };
