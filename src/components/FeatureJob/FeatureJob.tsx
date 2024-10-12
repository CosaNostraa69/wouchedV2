'use client'
import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const jobData = [
  {
    title: "Senior Software Engineer",
    company: "Awesome Tech Co.",
    location: "Remote",
    salary: "$120k - $150k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "On-Site",
    salary: "$100k - $130k",
    type: "Full-Time",
  },
];

const FeatureJob = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;
  const totalPages = Math.ceil(jobData.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobData.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-white to-gray-100 min-h-screen">
      <h2 className="text-5xl font-bold mb-8 mt-20 text-center text-black">
        Ensure Your Job... <span className="text-blue-500">Get Paid Higher</span>
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center space-x-4 mt-10">
        <select className="border border-gray-300 rounded-md p-2 w-44">
          <option value="">Select Location</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-Site</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <select className="border border-gray-300 rounded-md p-2 w-44">
          <option value="">Select Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
        </select>
        <select className="border border-gray-300 rounded-md p-2 w-44">
          <option value="">Job Position</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
        <select className="border border-gray-300 rounded-md p-2 w-44">
          <option value="">Pay Scale</option>
          <option value="80k">80k - 100k</option>
          <option value="100k">100k - 120k</option>
          <option value="120k">120k - 150k</option>
        </select>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 ml-20 mr-20">
        {currentJobs.map((job, index) => (
          <div
            key={index}
            className="border border-gray-300 p-6 rounded-md shadow-md bg-white hover:border-blue-500 transition-all transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-700 mb-2">{job.company}</p>
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <MapPin className="text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <DollarSign className="text-gray-500" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Briefcase className="text-gray-500" />
              <span>{job.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center p-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="mr-2" /> Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center p-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default FeatureJob;
