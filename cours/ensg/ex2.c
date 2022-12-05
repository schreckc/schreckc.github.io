#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>

using namespace std;

// ----------------------------------------------------------

int main()
{

  int tbl[16]    = {0,1,2,3,4,5,6,7,8,14,20,1,1,5,14,15};
  int result = 0;

  thread th[8];
  for (uint t = 0; t < 8; ++t) {
    th[t] = thread(...);
  }

  ...

    for (uint t = 0; t < 8; ++t) {
      th[t].join();
  }
  cerr << result << endl;

  // Ex2: * sum all elements in tbl
  //      * do the same using 2 threads
  //      * do the same using n threads
  
  return 0;
}

// ----------------------------------------------------------
