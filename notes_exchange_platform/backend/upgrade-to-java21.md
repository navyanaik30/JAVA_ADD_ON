Upgrade to Java 21 (manual plan)
=================================

This project is already configured to compile with Java 21 in `pom.xml` (property `java.version` and `maven-compiler-plugin` release=21).

Because the automated Copilot upgrade tool isn't available in this environment, follow these manual steps to complete the upgrade and verify the environment.

1) Install JDK 21
   - Recommended: Eclipse Temurin (Adoptium) or Oracle/OpenJDK distribution for Java 21.
   - Windows: download and install the JDK 21 MSI or ZIP from the vendor.
   - After install, set `JAVA_HOME` to the JDK 21 install folder and add `%JAVA_HOME%\bin` to your `PATH`.

2) Verify local Java
   - Run the included `verify-java21.cmd` in the `backend` folder:
     - `cd backend` then `verify-java21.cmd`
   - Alternatively: `java -version` (should show a `21` version string).

3) Build & test locally
   - From `backend` run:
     - `mvn -U -DskipTests=false clean verify`
   - The `maven-enforcer-plugin` has been added to `pom.xml` and will fail the build if Java != 21.

4) CI / Docker updates
   - Ensure CI uses a Java 21 runner or sets up a JDK 21 toolchain.
   - If Docker images are used, switch base images to a Java 21 JRE/JDK (e.g., `eclipse-temurin:21-jdk`).

5) Dependency compatibility checks
   - Most Spring Boot 3.2.x + Spring Framework 6.x work on Java 21.
   - If you rely on third-party libraries with native code, run integration tests and smoke tests.

6) Optional: Use Maven toolchains
   - If developers need multiple JDKs on the same machine, consider adding `toolchains.xml` and maven-toolchains plugin to select JDK 21 for this build.

7) Commit and document
   - Create a branch `upgrade/java21`, commit the `pom.xml` changes and docs; open a PR with test results and CI updates.

Troubleshooting tips
--------------------
- If `mvn` still uses a different Java, check `mvn -v` (Maven picks up the JDK that `JAVA_HOME` points to).
- On Windows, restart the terminal after updating `JAVA_HOME` / `PATH`.

Next steps (if build fails)
--------------------------
- Run `mvn -X clean verify` and inspect failing stack traces.
- Search for deprecated/removed APIs in compilation errors and update code accordingly.
- For binary-incompatible library issues, upgrade the library to a version that supports Java 21.

If you'd like, I can:
- Add a Maven toolchains example file in this repo.
- Create a CI job (GitHub Actions) that builds with JDK 21 and reports results.

