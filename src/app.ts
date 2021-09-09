import { Request, Response } from "express";
import axios from "axios";
import express from "express";
let bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
type StringOccurence = {
  word: string;
  output: StringOccurenceOutput;
};
type StringOccurenceOutput = {
  count: any;
  synonyms: string;
  pos: string;
};
app.get("/stringOccurence", async (req: Request, res: Response) => {
  const apiKey =
    "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9";
  const result = await axios.get("http://norvig.com/big.txt");
  const counts = {};
  for (const str of result.data.split(" ")) {
    if (str !== "") {
      counts[str] = counts[str] ? counts[str] + 1 : 1;
    }
  }
  let strSortable = [];
  for (const str in counts) {
    strSortable.push([str, counts[str]]);
  }
  strSortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  let resultObj: Array<StringOccurence> = [];
  for (let occurence = 0; occurence < 10; occurence++) {
    const result = await axios.get(
      `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${apiKey}&lang=en-ru&text=${strSortable[occurence][0]}`
    );
    let resultOccurence: StringOccurenceOutput = {
      count: strSortable[occurence][1],
      synonyms:
        result.data["def"].length === 0
          ? ""
          : result.data["def"][0]["tr"][0]["syn"],
      pos:
        result.data["def"].length === 0
          ? ""
          : result.data["def"][0]["tr"][0]["pos"],
    };
    let resultStringOccurence: StringOccurence = {
      word: strSortable[occurence][0],
      output: resultOccurence,
    };
    resultObj.push(resultStringOccurence);
  }
  return res.status(200).send(resultObj);
});
