import {User} from "@/types/user";
export const mockUsers: User[] = [
    {
        id: "1",
        email: "test@example.com",
        department: "Engineering",
        position: "Frontend Developer",
        profile: {
            first_name: "Testmatic",
            last_name: "Testson",
            avatar: "https://placehold.co/40",
            created_at: "February 3, 2022",
            skills: [
                { name: "JavaScript", categoryId: "1", mastery: "Expert" },
                { name: "TypeScript", categoryId: "1", mastery: "Proficient" },
                { name: "React", categoryId: "2", mastery: "Novice" },
                { name: "Next.js", categoryId: "2", mastery: "Proficient" },
                { name: "CSS", categoryId: "2", mastery: "Expert" },
                { name: "HTML", categoryId: "2", mastery: "Advanced" },
                { name: "Jest", categoryId: "4", mastery: "Competent" },
                { name: "Git", categoryId: "6", mastery: "Proficient" }
            ],
            languages: [
                { id: 1, name: "English", proficiency: "Native" },
                { id: 2, name: "Polish", proficiency: "B2" },
                { id: 3, name: "German", proficiency: "A2" },
                { id: 4, name: "Polish", proficiency: "Native" },
                { id: 5, name: "Russian", proficiency: "C1" },
                { id: 6, name: "Belarusian", proficiency: "B1" },
                { id: 7, name: "Italian", proficiency: "C2" },
            ],
        },
    },
    {
        id: "2",
        email: "testmatic@example.com",
        department: "Marketing",
        position: "SEO Specialist",
        profile: {
            first_name: "Test",
            last_name: "Matic",
            avatar: "https://placehold.co/40",
            created_at: "October 12, 2013",
            skills: [
                { name: "JavaScript", categoryId: "1", mastery: "Competent" },
                { name: "HTML", categoryId: "2", mastery: "Proficient" },
                { name: "CSS", categoryId: "2", mastery: "Proficient" },
                { name: "Google Analytics", mastery: "Expert" },
                { name: "SEO", mastery: "Expert" },
                { name: "Ahrefs", mastery: "Advanced" },
                { name: "Git", categoryId: "6", mastery: "Novice" }
            ],
            languages: [
                { id: 4, name: "English", proficiency: "C1" },
                { id: 5, name: "Spanish", proficiency: "B2" }
            ],
        },
    },
    {
        id: "3",
        email: "testmatic2@example.com",
        department: "HR",
        position: "Recruiter",
        profile: {
            first_name: "Anna",
            last_name: "Nowak",
            avatar: "https://placehold.co/40",
            created_at: "July 04, 2024",
            skills: [
                { name: "Communication", mastery: "Expert" },
                { name: "LinkedIn Recruiting", mastery: "Expert" },
                { name: "ATS Systems", mastery: "Advanced" },
                { name: "Interviewing", mastery: "Expert" },
                { name: "Negotiation", mastery: "Advanced" }
            ],
            languages: [
                { id: 6, name: "Polish", proficiency: "Native" },
                { id: 7, name: "English", proficiency: "C1" }
            ],
        },
    },
    {
        id: "4",
        email: "john.doe@example.com",
        department: "Engineering",
        position: "Backend Developer",
        profile: {
            first_name: "John",
            last_name: "Doe",
            avatar: "https://placehold.co/40",
            created_at: "January 15, 2020",
            skills: [
                { name: "Node.js", categoryId: "3", mastery: "Expert" },
                { name: "NestJS", categoryId: "3", mastery: "Proficient" },
                { name: "PostgreSQL", categoryId: "3", mastery: "Proficient" },
                { name: "Docker", categoryId: "5", mastery: "Competent" },
                { name: "Kubernetes", categoryId: "5", mastery: "Advanced" },
                { name: "Jest", categoryId: "4", mastery: "Proficient" },
                { name: "Git", categoryId: "6", mastery: "Expert" }
            ],
            languages: [
                { id: 8, name: "English", proficiency: "Native" },
                { id: 9, name: "German", proficiency: "B1" }
            ],
        },
    },
    {
        id: "8",
        email: "daniel.wilson@example.com",
        department: "Engineering",
        position: "DevOps Engineer",
        profile: {
            first_name: "Daniel",
            last_name: "Wilson",
            avatar: "https://placehold.co/40",
            created_at: "February 11, 2022",
            skills: [
                { name: "Docker", categoryId: "5", mastery: "Expert" },
                { name: "Kubernetes", categoryId: "5", mastery: "Expert" },
                { name: "AWS", categoryId: "5", mastery: "Proficient" },
                { name: "Terraform", categoryId: "5", mastery: "Advanced" },
                { name: "CI/CD", categoryId: "5", mastery: "Expert" },
                { name: "Linux", mastery: "Expert" },
                { name: "GitHub Actions", categoryId: "6", mastery: "Proficient" }
            ],
            languages: [
                { id: 60, name: "English", proficiency: "Native" },
                { id: 61, name: "Italian", proficiency: "B1" }
            ],
        },
    },

    {
        id: "5",
        email: "emma.smith@example.com",
        department: "Engineering",
        position: "Fullstack Developer",
        profile: {
            first_name: "Emma",
            last_name: "Smith",
            avatar: "https://placehold.co/40",
            created_at: "March 12, 2021",
            skills: [
                { name: "JavaScript", categoryId: "1", mastery: "Expert" },
                { name: "TypeScript", categoryId: "1", mastery: "Proficient" },
                { name: "React", categoryId: "2", mastery: "Expert" },
                { name: "Node.js", categoryId: "3", mastery: "Proficient" },
                { name: "GraphQL", categoryId: "3", mastery: "Advanced" },
                { name: "Docker", categoryId: "5", mastery: "Competent" }
            ],
            languages: [
                { id: 10, name: "English", proficiency: "Native" },
                { id: 11, name: "French", proficiency: "B2" }
            ],
        },
    },
    {
        id: "6",
        email: "liam.brown@example.com",
        department: "Engineering",
        position: "Backend Developer",
        profile: {
            first_name: "Liam",
            last_name: "Brown",
            avatar: "https://placehold.co/40",
            created_at: "June 18, 2019",
            skills: [
                { name: "Java", categoryId: "1", mastery: "Expert" },
                { name: "Spring Boot", categoryId: "3", mastery: "Expert" },
                { name: "PostgreSQL", categoryId: "3", mastery: "Proficient" },
                { name: "Redis", categoryId: "3", mastery: "Advanced" },
                { name: "Docker", categoryId: "5", mastery: "Proficient" },
                { name: "Git", categoryId: "6", mastery: "Expert" }
            ],
            languages: [
                { id: 10, name: "English", proficiency: "Native" },
                { id: 11, name: "French", proficiency: "B2" }
            ],
        },
    },
    {
        id: "7",
        email: "olivia.jones@example.com",
        department: "Design",
        position: "UI Designer",
        profile: {
            first_name: "Olivia",
            last_name: "Jones",
            avatar: "https://placehold.co/40",
            created_at: "August 9, 2020",
            skills: [
                { name: "Figma", mastery: "Expert" },
                { name: "Sketch", mastery: "Advanced" },
                { name: "CSS", categoryId: "2", mastery: "Proficient" },
                { name: "HTML", categoryId: "2", mastery: "Proficient" },
                { name: "UX Research", mastery: "Advanced" }
            ],
            languages: [
                { id: 10, name: "English", proficiency: "Native" },
                { id: 11, name: "French", proficiency: "B2" }
            ],
        },
    },
    {
        id: "9",
        email: "noah.taylor@example.com",
        department: "Engineering",
        position: "QA Engineer",
        profile: {
            first_name: "Noah",
            last_name: "Taylor",
            avatar: "https://placehold.co/40",
            created_at: "November 2, 2021",
            skills: [
                { name: "Jest", categoryId: "4", mastery: "Expert" },
                { name: "Cypress", categoryId: "4", mastery: "Expert" },
                { name: "Selenium", categoryId: "4", mastery: "Advanced" },
                { name: "JavaScript", categoryId: "1", mastery: "Proficient" },
                { name: "Git", categoryId: "6", mastery: "Proficient" }
            ],
            languages: [
                { id: 10, name: "English", proficiency: "Native" },
                { id: 11, name: "French", proficiency: "B2" }
            ],
        },
    },
    {
        id: "10",
        email: "ava.martinez@example.com",
        department: "Marketing",
        position: "Content Strategist",
        profile: {
            first_name: "Ava",
            last_name: "Martinez",
            avatar: "https://placehold.co/40",
            created_at: "May 5, 2018",
            skills: [
                { name: "SEO", mastery: "Expert" },
                { name: "Content Writing", mastery: "Expert" },
                { name: "Google Analytics", mastery: "Proficient" },
                { name: "Copywriting", mastery: "Expert" },
                { name: "Ahrefs", mastery: "Advanced" }
            ],
            languages: [
                { id: 60, name: "English", proficiency: "Native" },
                { id: 61, name: "Italian", proficiency: "B1" }
            ],
        },
    },
    {
        id: "11",
        email: "william.anderson@example.com",
        department: "Engineering",
        position: "DevOps Engineer",
        profile: {
            first_name: "William",
            last_name: "Anderson",
            avatar: "https://placehold.co/40",
            created_at: "April 22, 2020",
            skills: [
                { name: "AWS", categoryId: "5", mastery: "Expert" },
                { name: "Terraform", categoryId: "5", mastery: "Expert" },
                { name: "Kubernetes", categoryId: "5", mastery: "Proficient" },
                { name: "Docker", categoryId: "5", mastery: "Expert" },
                { name: "CI/CD", categoryId: "5", mastery: "Expert" },
                { name: "Linux", mastery: "Expert" }
            ],
            languages: [
                { id: 60, name: "English", proficiency: "Native" },
                { id: 61, name: "Italian", proficiency: "B1" }
            ],
        },
    },
    {
        id: "12",
        email: "sophia.thomas@example.com",
        department: "HR",
        position: "HR Manager",
        profile: {
            first_name: "Sophia",
            last_name: "Thomas",
            avatar: "https://placehold.co/40",
            created_at: "January 30, 2017",
            skills: [
                { name: "Leadership", mastery: "Expert" },
                { name: "Recruitment", mastery: "Expert" },
                { name: "Conflict Resolution", mastery: "Advanced" },
                { name: "Communication", mastery: "Expert" },
                { name: "Negotiation", mastery: "Advanced" }
            ],
            languages: [
                { id: 8, name: "English", proficiency: "Native" },
                { id: 9, name: "German", proficiency: "B1" }
            ],
        },
    },
    {
        id: "13",
        email: "james.jackson@example.com",
        department: "Engineering",
        position: "Mobile Developer",
        profile: {
            first_name: "James",
            last_name: "Jackson",
            avatar: "https://placehold.co/40",
            created_at: "September 14, 2021",
            skills: [
                { name: "React Native", categoryId: "2", mastery: "Expert" },
                { name: "Swift", categoryId: "1", mastery: "Advanced" },
                { name: "Kotlin", categoryId: "1", mastery: "Advanced" },
                { name: "TypeScript", categoryId: "1", mastery: "Proficient" },
                { name: "Git", categoryId: "6", mastery: "Proficient" }
            ],
            languages: [
                { id: 8, name: "English", proficiency: "Native" },
                { id: 9, name: "German", proficiency: "B1" }
            ],
        },
    },
    {
        id: "14",
        email: "mia.white@example.com",
        department: "Finance",
        position: "Financial Analyst",
        profile: {
            first_name: "Mia",
            last_name: "White",
            avatar: "https://placehold.co/40",
            created_at: "July 7, 2019",
            skills: [
                { name: "Excel", mastery: "Expert" },
                { name: "Financial Modeling", mastery: "Expert" },
                { name: "Data Analysis", mastery: "Advanced" },
                { name: "SQL", categoryId: "3", mastery: "Proficient" },
                { name: "Power BI", mastery: "Advanced" }
            ],
            languages: [
                { id: 6, name: "Polish", proficiency: "Native" },
                { id: 7, name: "English", proficiency: "C1" }
            ],
        },
    },
    {
        id: "15",
        email: "benjamin.harris@example.com",
        department: "Engineering",
        position: "Backend Developer",
        profile: {
            first_name: "Benjamin",
            last_name: "Harris",
            avatar: "https://placehold.co/40",
            created_at: "March 3, 2022",
            skills: [
                { name: "Python", categoryId: "1", mastery: "Expert" },
                { name: "Django", categoryId: "3", mastery: "Expert" },
                { name: "PostgreSQL", categoryId: "3", mastery: "Proficient" },
                { name: "Docker", categoryId: "5", mastery: "Proficient" },
                { name: "Git", categoryId: "6", mastery: "Expert" }
            ],
            languages: [
                { id: 6, name: "Polish", proficiency: "Native" },
                { id: 7, name: "English", proficiency: "C1" }
            ],
        },
    },
    {
        id: "16",
        email: "charlotte.clark@example.com",
        department: "Design",
        position: "UX Designer",
        profile: {
            first_name: "Charlotte",
            last_name: "Clark",
            avatar: "https://placehold.co/40",
            created_at: "February 25, 2020",
            skills: [
                { name: "UX Research", mastery: "Expert" },
                { name: "Figma", mastery: "Expert" },
                { name: "Wireframing", mastery: "Expert" },
                { name: "Prototyping", mastery: "Advanced" },
                { name: "User Testing", mastery: "Advanced" }
            ],
            languages: [
                { id: 6, name: "Polish", proficiency: "Native" },
                { id: 7, name: "English", proficiency: "C1" }
            ],
        },
    },
    {
        id: "17",
        email: "elijah.lewis@example.com",
        department: "Engineering",
        position: "Security Engineer",
        profile: {
            first_name: "Elijah",
            last_name: "Lewis",
            avatar: "https://placehold.co/40",
            created_at: "June 1, 2021",
            skills: [
                { name: "Cybersecurity", mastery: "Expert" },
                { name: "Penetration Testing", mastery: "Advanced" },
                { name: "Linux", mastery: "Expert" },
                { name: "Docker", categoryId: "5", mastery: "Competent" },
                { name: "Networking", mastery: "Advanced" }
            ],
            languages: [
                { id: 6, name: "Polish", proficiency: "Native" },
                { id: 7, name: "English", proficiency: "C1" }
            ],
        },
    },
    {
        id: "18",
        email: "amelia.walker@example.com",
        department: "Support",
        position: "Customer Support",
        profile: {
            first_name: "Amelia",
            last_name: "Walker",
            avatar: "https://placehold.co/40",
            created_at: "October 10, 2023",
            skills: [
                { name: "Communication", mastery: "Expert" },
                { name: "Problem Solving", mastery: "Expert" },
                { name: "CRM Tools", mastery: "Advanced" },
                { name: "Zendesk", mastery: "Proficient" },
                { name: "Customer Service", mastery: "Expert" }
            ],
            languages: [
                { id: 4, name: "English", proficiency: "C1" },
                { id: 5, name: "Spanish", proficiency: "B2" }
            ],

        },
    },
    {
        id: "19",
        email: "lucas.hall@example.com",
        department: "Engineering",
        position: "Data Engineer",
        profile: {
            first_name: "Lucas",
            last_name: "Hall",
            avatar: "https://placehold.co/40",
            created_at: "May 19, 2022",
            skills: [
                { name: "Python", categoryId: "1", mastery: "Expert" },
                { name: "Spark", mastery: "Advanced" },
                { name: "Kafka", mastery: "Advanced" },
                { name: "SQL", categoryId: "3", mastery: "Expert" },
                { name: "AWS", categoryId: "5", mastery: "Proficient" }
            ],
            languages: [
                { id: 4, name: "English", proficiency: "C1" },
                { id: 5, name: "Spanish", proficiency: "B2" }
            ],
        },
    },
    {
        id: "20",
        email: "harper.young@example.com",
        department: "Marketing",
        position: "Social Media Manager",
        profile: {
            first_name: "Harper",
            last_name: "Young",
            avatar: "https://placehold.co/40",
            created_at: "January 8, 2021",
            skills: [
                { name: "Social Media Marketing", mastery: "Expert" },
                { name: "Content Creation", mastery: "Expert" },
                { name: "SEO", mastery: "Advanced" },
                { name: "Analytics", mastery: "Proficient" },
                { name: "Copywriting", mastery: "Advanced" }
            ],
            languages: [
                { id: 4, name: "English", proficiency: "C1" },
                { id: 5, name: "Spanish", proficiency: "B2" }
            ],
        },
    },
    {
        id: "21",
        email: "henry.king@example.com",
        department: "Engineering",
        position: "AI Engineer",
        profile: {
            first_name: "Henry",
            last_name: "King",
            avatar: "https://placehold.co/40",
            created_at: "August 30, 2022",
            skills: [
                { name: "Python", categoryId: "1", mastery: "Expert" },
                { name: "TensorFlow", mastery: "Expert" },
                { name: "PyTorch", mastery: "Advanced" },
                { name: "Machine Learning", mastery: "Expert" },
                { name: "Data Science", mastery: "Advanced" }
            ],
            languages: [
                { id: 1, name: "English", proficiency: "Native" },
                { id: 2, name: "Polish", proficiency: "B2" },
                { id: 3, name: "German", proficiency: "A2" }
            ],
        },
    },
    {
        id: "22",
        email: "evelyn.scott@example.com",
        department: "Legal",
        position: "Legal Advisor",
        profile: {
            first_name: "Evelyn",
            last_name: "Scott",
            avatar: "https://placehold.co/40",
            created_at: "April 14, 2016",
            skills: [
                { name: "Contract Law", mastery: "Expert" },
                { name: "Negotiation", mastery: "Expert" },
                { name: "Compliance", mastery: "Advanced" },
                { name: "Risk Assessment", mastery: "Advanced" },
                { name: "Communication", mastery: "Expert" }
            ],
            languages: [
                { id: 1, name: "English", proficiency: "Native" },
                { id: 2, name: "Polish", proficiency: "B2" },
                { id: 3, name: "German", proficiency: "A2" }
            ],
        },
    },
    {
        id: "23",
        email: "jack.green@example.com",
        department: "Engineering",
        position: "Game Developer",
        profile: {
            first_name: "Jack",
            last_name: "Green",
            avatar: "https://placehold.co/40",
            created_at: "December 12, 2020",
            skills: [
                { name: "C++", categoryId: "1", mastery: "Expert" },
                { name: "Unity", mastery: "Expert" },
                { name: "Unreal Engine", mastery: "Advanced" },
                { name: "3D Modeling", mastery: "Advanced" },
                { name: "Git", categoryId: "6", mastery: "Proficient" }
            ],
            languages: [
                { id: 1, name: "English", proficiency: "Native" },
                { id: 2, name: "Polish", proficiency: "B2" },
                { id: 3, name: "German", proficiency: "A2" }
            ],
        },

    },
    {
        id: "24",
        email: "ella.adams@example.com",
        department: "Engineering",
        position: "Frontend Developer",
        profile: {
            first_name: "Ella",
            last_name: "Adams",
            avatar: "https://placehold.co/40",
            created_at: "June 6, 2023",
            skills: [
                { name: "HTML", categoryId: "2", mastery: "Expert" },
                { name: "CSS", categoryId: "2", mastery: "Expert" },
                { name: "JavaScript", categoryId: "1", mastery: "Proficient" },
                { name: "React", categoryId: "2", mastery: "Proficient" },
                { name: "Next.js", categoryId: "2", mastery: "Advanced" }
            ],
            languages: [
                { id: 4, name: "English", proficiency: "C1" },
                { id: 5, name: "Spanish", proficiency: "B2" }
            ],
        },

    }

];