import React from "react";
import {
  Award,
  Briefcase,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Building2,
  BarChart2,
  Book,
} from "lucide-react";

const ProfileSection = ({ profileData }) => {
  if (!profileData) return null;

  const { personalInfo, statistics, skills, certifications } = profileData;

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <User className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{personalInfo.Name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{personalInfo.Email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{personalInfo.Role}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Building2 className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{personalInfo.Department}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Hash className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-medium">{personalInfo["Employee ID"]}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Joined Date</p>
            <p className="font-medium">{personalInfo["Joined Date"]}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{personalInfo.Contact}</p>
          </div>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{personalInfo.Location}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        <BarChart2 className="w-5 h-5 inline-block mr-2 text-blue-600" />
        Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statistics).map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">{key}</p>
            <p className="text-xl font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        <Book className="w-5 h-5 inline-block mr-2 text-blue-600" />
        Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        <Award className="w-5 h-5 inline-block mr-2 text-blue-600" />
        Certifications
      </h3>
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
          >
            <p className="font-medium text-gray-800">{cert.name}</p>
            <p className="text-sm text-gray-500">
              Valid from {cert.issueDate} to {cert.validUntil}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {renderPersonalInfo()}
      {renderStatistics()}
      {renderSkills()}
      {renderCertifications()}
    </div>
  );
};

export default ProfileSection;
