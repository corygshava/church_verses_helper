// this is responsible for reading files and returning file lists and file contents

import { readdir, stat } from "node:fs/promises";
import path from "node:path";

