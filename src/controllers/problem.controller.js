import { use } from "react";
import { db } from "../libs/db.js";
import { getJudege0LanguageID, submitBatch } from "../libs/judge0.lib.js";

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role != "ADMIN") {
    return res.status(403).json({
      error: "Forbidden. Only admins can create problems.",
    });
  }
  try {
    for (const [language, SolutionCode] of Object.entries(referenceSolutions)) {
      const languageID = getJudege0LanguageID(language);

      if (!languageID) {
        return res.status(400).json({
          error: `Unsupported language: ${language}`,
        });
      }

      const submissions = testcases.map(({ input, output }) => {
        source_code: SolutionCode;
        language_id: languageID;
        stdin: input;
        expected_output: output;
      });

      const submissionsResult = await submitBatch(submissions);

      const token = submissionsResult.map((res) => res.token);
    }
  } catch (error) {}
};

const getAllproblems = async (req, res) => {};
const getProblemById = async (req, res) => {};
const updateProblem = async (req, res) => {};

const deleteProblem = async (req, res) => {};

const getSolvedProblems = async (req, res) => {};

export {
  createProblem,
  getAllproblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getSolvedProblems,
};
